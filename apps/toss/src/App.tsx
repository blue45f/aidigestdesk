import { SourceDetailPage } from './pages/SourceDetailPage.tsx';
import { SourceListPage } from './pages/SourceListPage.tsx';
import { useHashPath } from './router';

export function App() {
  const path = useHashPath();
  const m = path.match(/^\/source\/(.+)$/);
  if (m) return <SourceDetailPage id={decodeURIComponent(m[1])} />;
  return <SourceListPage />;
}
