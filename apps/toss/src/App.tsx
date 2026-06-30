import { CommunityPage } from './pages/CommunityPage.tsx';
import { DealsPage } from './pages/DealsPage.tsx';
import { ManualDetailPage } from './pages/ManualDetailPage.tsx';
import { ManualListPage } from './pages/ManualListPage.tsx';
import { ProfilePage } from './pages/ProfilePage.tsx';
import { RankExtensionDetailPage } from './pages/RankExtensionDetailPage.tsx';
import { RankingListPage } from './pages/RankingListPage.tsx';
import { RankModelDetailPage } from './pages/RankModelDetailPage.tsx';
import { ResourcesPage } from './pages/ResourcesPage.tsx';
import { SavedPage } from './pages/SavedPage.tsx';
import { SupportPage } from './pages/SupportPage.tsx';
import { UpdateDetailPage } from './pages/UpdateDetailPage.tsx';
import { UpdateListPage } from './pages/UpdateListPage.tsx';
import { enhanceRails, playTick, tapRipple } from '@aidigestdesk/content/shared';
import { useEffect, useRef } from 'react';

import { navigate, usePathname, registerPreNavigate } from './router';
import { trackScreen } from './lib/analytics';
import { haptic } from './lib/haptic';
import { MusicToggle } from './components/MusicToggle.tsx';
import IntroSplashScreen from './components/IntroSplashScreen.tsx';
import { TabBar, type TabId } from './ui';
import { useTossFullScreenAd } from './lib/ads.ts';

export function App() {
  const path = usePathname();
  const interstitial = useTossFullScreenAd('interstitial');
  const navigationCountRef = useRef(0);
  const lastAdTimeRef = useRef(0);

  useEffect(() => {
    trackScreen(path);
  }, [path]);

  // 페이지 이동 시 전면 광고 노출 설정
  useEffect(() => {
    registerPreNavigate(() => {
      if (interstitial.configured && interstitial.supported) {
        navigationCountRef.current += 1;
        const now = Date.now();
        const freqOk = navigationCountRef.current >= 3;
        const timeOk = now - lastAdTimeRef.current >= 2 * 60 * 1000;
        if (interstitial.ready && freqOk && timeOk && interstitial.show()) {
          navigationCountRef.current = 0;
          lastAdTimeRef.current = now;
        }
      }
    });
    return () => {
      registerPreNavigate(null);
    };
  }, [interstitial]);

  // 전역 클릭 효과음 + 가벼운 햅틱 — 모든 인터랙티브 요소(리스너 1개로 위임).
  // 타이틀(.aid-shimmer-title)은 자체 스파클·confetti 햅틱을 내므로 제외.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || target.closest('.aid-shimmer-title')) return;
      if (target.closest('button, a, [role="button"], [role="tab"], label, select, input:not([type="text"]):not([type="email"]):not([type="search"])')) {
        playTick();
        haptic('tickWeak');
        tapRipple(e.clientX, e.clientY);
      }
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  // 가로 레일 드래그 스크롤 + 관성(.chips 등). 라우트 변경마다 새 레일에 부착.
  useEffect(() => {
    const id = window.setTimeout(() => enhanceRails(), 60);
    return () => window.clearTimeout(id);
  }, [path]);

  // 상세 페이지(탭바 없음)
  const updateDetail = path.match(/^\/update\/(.+)$/);
  const modelDetail = path.match(/^\/rank\/m\/(.+)$/);
  const extDetail = path.match(/^\/rank\/x\/(.+)$/);
  const manualDetail = path.match(/^\/manual\/(.+)$/);
  const isSupport = path === '/support';
  const isSaved = path === '/saved';
  const isCommunity = path === '/community';
  const isProfile = path === '/profile';

  if (updateDetail || modelDetail || extDetail || manualDetail || isSupport || isSaved || isCommunity || isProfile) {
    const detail = updateDetail ? (
      <UpdateDetailPage id={decodeURIComponent(updateDetail[1])} />
    ) : modelDetail ? (
      <RankModelDetailPage id={decodeURIComponent(modelDetail[1])} />
    ) : extDetail ? (
      <RankExtensionDetailPage id={decodeURIComponent(extDetail[1])} />
    ) : manualDetail ? (
      <ManualDetailPage slug={decodeURIComponent(manualDetail[1])} />
    ) : isSaved ? (
      <SavedPage />
    ) : isCommunity ? (
      <CommunityPage />
    ) : isProfile ? (
      <ProfilePage />
    ) : (
      <SupportPage />
    );
    return (
      <>
        <IntroSplashScreen />
        <div key={path} className="page-enter">{detail}</div>
        <MusicToggle />
      </>
    );
  }

  const tab: TabId =
    path === '/rankings' ? 'rank'
    : path === '/deals' ? 'deals'
    : path === '/resources' ? 'resources'
    : path === '/manuals' ? 'manual'
    : 'feed';

  const page =
    tab === 'rank' ? <RankingListPage />
    : tab === 'deals' ? <DealsPage />
    : tab === 'resources' ? <ResourcesPage />
    : tab === 'manual' ? <ManualListPage />
    : <UpdateListPage />;

  const tabToPath: Record<TabId, string> = {
    feed: '/', rank: '/rankings', deals: '/deals', resources: '/resources', manual: '/manuals',
  };

  return (
    <>
      <IntroSplashScreen />
      <div key={path} className="page-enter">{page}</div>
      {/* 하단 고정 탭바에 가려지지 않도록 여백 확보 */}
      <div aria-hidden style={{ height: 'calc(56px + env(safe-area-inset-bottom))' }} />
      <TabBar active={tab} onPick={(t) => navigate(tabToPath[t])} />
      <MusicToggle />
    </>
  );
}
