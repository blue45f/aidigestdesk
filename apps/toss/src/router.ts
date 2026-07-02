import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

import { trackNavigation } from './lib/analytics';

// 브라우저(History API) 라우터 — 해시(#) 없이 pathname으로 라우팅한다.
// 주의: 새로고침/딥링크가 정상 동작하려면 호스트가 모든 경로에 index.html을
// 폴백 서빙해야 한다(vite dev/preview는 SPA 폴백 기본 제공). 앱인토스 WebView에서는
// 세션 내 in-app 내비게이션(pushState)으로 동작한다.

function currentPath(): string {
  return window.location.pathname || '/';
}

export function usePathname(): string {
  const [path, setPath] = useState(currentPath);
  useEffect(() => {
    const onChange = () => setPath(currentPath());
    window.addEventListener('popstate', onChange);
    return () => window.removeEventListener('popstate', onChange);
  }, []);
  return path;
}

let preNavigateCallback: ((to: string) => void) | null = null;

export function registerPreNavigate(cb: ((to: string) => void) | null): void {
  preNavigateCallback = cb;
}

/** pushState + popstate 디스패치 — pushState는 popstate를 발생시키지 않으므로 직접 알린다. */
function commitNavigation(to: string): void {
  window.history.pushState(null, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

function prefersReducedMotion(): boolean {
  try {
    return !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

export function navigate(to: string): void {
  if (to === window.location.pathname) return;
  // preNavigate(전면광고 케이던스 게이트)는 매 navigate마다 정확히 1회,
  // 뷰 트랜지션 "밖에서" 먼저 호출한다 — 광고 show()와 전환 연출이 서로를 막지 않게.
  if (preNavigateCallback) {
    try {
      preNavigateCallback(to);
    } catch {
      // no-op
    }
  }
  trackNavigation(to);

  // View Transitions — 지원 + 모션 허용 시 라우트 커밋을 트랜지션 콜백 안에서 동기 flush.
  // 미지원/reduced-motion은 기존 .page-enter 폴백 유지.
  const startViewTransition = document.startViewTransition?.bind(document);
  if (!startViewTransition || prefersReducedMotion()) {
    commitNavigation(to);
    return;
  }
  // VT 진행 중에는 .page-enter 키프레임을 꺼 이중 애니메이션을 방지한다(index.css .vt-active).
  document.documentElement.classList.add('vt-active');
  const transition = startViewTransition(() => {
    flushSync(() => {
      commitNavigation(to);
    });
  });
  void transition.finished.finally(() => {
    document.documentElement.classList.remove('vt-active');
  });
}

/**
 * 뒤로가기 — 히스토리가 있으면 history.back(목록의 정렬/필터 상태 보존), 없으면(직접 진입)
 * fallback 경로로 이동. 상세 페이지의 BackBar가 pushState로 항목을 또 쌓지 않게 한다.
 */
export function goBack(fallback = '/'): void {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    navigate(fallback);
  }
}
