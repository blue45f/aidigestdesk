import { Analytics } from '@apps-in-toss/web-framework';

type AnalyticsParam = string | number | boolean | null | undefined;
type AnalyticsParams = Record<string, AnalyticsParam>;

function ignoreAnalyticsFailure(result: Promise<void> | undefined): void {
  void result?.catch(() => undefined);
}

function contentRoute(to: string): { contentType: string; contentId: string } | null {
  const match = to.match(/^\/(update|manual|rank\/m|rank\/x)\/(.+)$/);
  if (!match) return null;

  const contentType =
    match[1] === 'update'
      ? 'update'
      : match[1] === 'manual'
        ? 'manual'
        : match[1] === 'rank/m'
          ? 'model'
          : 'extension';

  return { contentType, contentId: decodeURIComponent(match[2]).slice(0, 120) };
}

function screenName(path: string): string {
  if (path.startsWith('/update/')) return 'update_detail_screen';
  if (path.startsWith('/manual/')) return 'manual_detail_screen';
  if (path.startsWith('/rank/m/')) return 'model_detail_screen';
  if (path.startsWith('/rank/x/')) return 'extension_detail_screen';
  if (path === '/rankings') return 'rankings_screen';
  if (path === '/deals') return 'deals_screen';
  if (path === '/resources') return 'resources_screen';
  if (path === '/manuals') return 'manuals_screen';
  if (path === '/saved') return 'saved_screen';
  if (path === '/community') return 'community_screen';
  if (path === '/profile') return 'profile_screen';
  if (path === '/support') return 'support_screen';
  return 'updates_screen';
}

export function trackScreen(path: string): void {
  try {
    const content = contentRoute(path);
    ignoreAnalyticsFailure(
      Analytics.screen({
        log_name: screenName(path),
        ...(content
          ? { content_type: content.contentType, content_id: content.contentId }
          : undefined),
      }),
    );
  } catch {
    // 일반 웹/프리뷰처럼 Apps in Toss 분석 브릿지가 없는 환경에서는 조용히 건너뛴다.
  }
}

export function trackNavigation(to: string): void {
  try {
    const content = contentRoute(to);
    const params: AnalyticsParams = content
      ? {
          log_name: 'content_detail_open',
          content_type: content.contentType,
          content_id: content.contentId,
          destination: to.slice(0, 180),
        }
      : { log_name: 'internal_navigation', destination: to.slice(0, 180) };
    ignoreAnalyticsFailure(Analytics.click(params));
  } catch {
    // 분석 실패가 실제 화면 이동을 막으면 안 된다.
  }
}
