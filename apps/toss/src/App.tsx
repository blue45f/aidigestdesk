import { ManualDetailPage } from './pages/ManualDetailPage.tsx';
import { ManualListPage } from './pages/ManualListPage.tsx';
import { RankExtensionDetailPage } from './pages/RankExtensionDetailPage.tsx';
import { RankingListPage } from './pages/RankingListPage.tsx';
import { RankModelDetailPage } from './pages/RankModelDetailPage.tsx';
import { UpdateDetailPage } from './pages/UpdateDetailPage.tsx';
import { UpdateListPage } from './pages/UpdateListPage.tsx';
import { navigate, useHashPath } from './router';
import IntroSplashScreen from './components/IntroSplashScreen.tsx';
import { TabBar, type TabId } from './ui';

export function App() {
  const path = useHashPath();

  // 상세 페이지(탭바 없음)
  const updateDetail = path.match(/^\/update\/(.+)$/);
  const modelDetail = path.match(/^\/rank\/m\/(.+)$/);
  const extDetail = path.match(/^\/rank\/x\/(.+)$/);
  const manualDetail = path.match(/^\/manual\/(.+)$/);

  if (updateDetail || modelDetail || extDetail || manualDetail) {
    const detail = updateDetail ? (
      <UpdateDetailPage id={decodeURIComponent(updateDetail[1])} />
    ) : modelDetail ? (
      <RankModelDetailPage id={decodeURIComponent(modelDetail[1])} />
    ) : extDetail ? (
      <RankExtensionDetailPage id={decodeURIComponent(extDetail[1])} />
    ) : (
      <ManualDetailPage slug={decodeURIComponent(manualDetail![1])} />
    );
    return (
      <>
        <IntroSplashScreen />
        {detail}
      </>
    );
  }

  const tab: TabId = path === '/rankings' ? 'rank' : path === '/manuals' ? 'manual' : 'feed';
  const page =
    tab === 'rank' ? <RankingListPage /> : tab === 'manual' ? <ManualListPage /> : <UpdateListPage />;
  const tabToPath: Record<TabId, string> = { feed: '/', rank: '/rankings', manual: '/manuals' };

  return (
    <>
      <IntroSplashScreen />
      {page}
      {/* 하단 고정 탭바에 가려지지 않도록 여백 확보 */}
      <div aria-hidden style={{ height: 'calc(56px + env(safe-area-inset-bottom))' }} />
      <TabBar active={tab} onPick={(t) => navigate(tabToPath[t])} />
    </>
  );
}
