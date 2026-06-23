import { UpdateDetailPage } from './pages/UpdateDetailPage.tsx';
import { UpdateListPage } from './pages/UpdateListPage.tsx';
import { useHashPath } from './router';
import IntroSplashScreen from './components/IntroSplashScreen.tsx';

export function App() {
  const path = useHashPath();
  const m = path.match(/^\/update\/(.+)$/);
  const content = m ? (
    <UpdateDetailPage id={decodeURIComponent(m[1])} />
  ) : (
    <UpdateListPage />
  );

  return (
    <>
      <IntroSplashScreen />
      {content}
    </>
  );
}
