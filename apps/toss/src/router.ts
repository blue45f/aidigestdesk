import { useEffect, useState } from 'react';

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

export function navigate(to: string): void {
  if (to === window.location.pathname) return;
  window.history.pushState(null, '', to);
  // pushState는 popstate를 발생시키지 않으므로 직접 디스패치해 구독자를 갱신한다.
  window.dispatchEvent(new PopStateEvent('popstate'));
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
