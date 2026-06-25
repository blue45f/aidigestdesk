// 정렬 비교 — 웹·토스 공유(의존성 0). 빈 값(null/'')은 방향과 무관하게 항상 끝으로 보낸다.

export type SortDir = 'asc' | 'desc';

/**
 * null/빈 문자열은 정렬 방향과 무관하게 항상 뒤로 보내는 비교 함수.
 * 숫자면 수치 비교, 그 외엔 ko locale 문자열 비교. 같으면 0(호출부가 안정 정렬 보정).
 * 웹 RankingBoard·토스 RankingListPage가 같은 규칙을 쓰게 한다.
 */
export function compareNullsLast(
  a: number | string | null | undefined,
  b: number | string | null | undefined,
  dir: SortDir = 'asc'
): number {
  const an = a === null || a === undefined || a === '';
  const bn = b === null || b === undefined || b === '';
  if (an && bn) return 0;
  if (an) return 1;
  if (bn) return -1;
  let cmp: number;
  if (typeof a === 'number' && typeof b === 'number') cmp = a - b;
  else cmp = String(a).localeCompare(String(b), 'ko');
  return dir === 'asc' ? cmp : -cmp;
}
