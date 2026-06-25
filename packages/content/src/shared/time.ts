// 시간 표기 — 웹·토스 공유(의존성 0). 커뮤니티·피드 등에서 작성 시각을 상대표기한다.

/** ISO 시각을 "방금 전 / n분 전 / n시간 전 / n일 전 / 날짜(7일 초과)"로 표기한다. */
export function formatRelativeTime(iso: string): string {
  const created = new Date(iso).getTime();
  if (Number.isNaN(created)) return '';

  const diffMs = Date.now() - created;
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < 0 || diffMs < minute) return '방금 전';
  if (diffMs < hour) return `${Math.floor(diffMs / minute)}분 전`;
  if (diffMs < day) return `${Math.floor(diffMs / hour)}시간 전`;
  if (diffMs < 7 * day) return `${Math.floor(diffMs / day)}일 전`;

  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
