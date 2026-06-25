import { RankExtensionDetailPage } from './pages/RankExtensionDetailPage.tsx';
import { RankingListPage } from './pages/RankingListPage.tsx';
import { RankModelDetailPage } from './pages/RankModelDetailPage.tsx';
import { UpdateDetailPage } from './pages/UpdateDetailPage.tsx';
import { UpdateListPage } from './pages/UpdateListPage.tsx';
import { navigate, useHashPath } from './router';
import IntroSplashScreen from './components/IntroSplashScreen.tsx';
import { TabBar } from './ui';

export function App() {
  const path = useHashPath();

  // 상세 페이지(탭바 없음)
  const updateDetail = path.match(/^\/update\/(.+)$/);
  const modelDetail = path.match(/^\/rank\/m\/(.+)$/);
  const extDetail = path.match(/^\/rank\/x\/(.+)$/);

  if (updateDetail || modelDetail || extDetail) {
    const detail = updateDetail ? (
      <UpdateDetailPage id={decodeURIComponent(updateDetail[1])} />
    ) : modelDetail ? (
      <RankModelDetailPage id={decodeURIComponent(modelDetail[1])} />
    ) : (
      <RankExtensionDetailPage id={decodeURIComponent(extDetail![1])} />
    );
    return (
      <>
        <IntroSplashScreen />
        {detail}
      </>
    );
  }

  const onRankings = path === '/rankings';

  return (
    <>
      <IntroSplashScreen />
      {onRankings ? <RankingListPage /> : <UpdateListPage />}
      {/* 하단 고정 탭바에 가려지지 않도록 여백 확보 */}
      <div aria-hidden style={{ height: 'calc(56px + env(safe-area-inset-bottom))' }} />
      <TabBar
        active={onRankings ? 'rank' : 'feed'}
        onPick={(t) => navigate(t === 'rank' ? '/rankings' : '/')}
      />
    </>
  );
}
