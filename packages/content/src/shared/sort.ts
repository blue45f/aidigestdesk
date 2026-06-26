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

/**
 * 키 추출자(pick)로 안정 정렬 — compareNullsLast 규칙(빈 값 뒤로) + 동률은 원본 인덱스로 안정화.
 * 웹·토스가 같은 "키로 정렬" 로직을 공유한다(각 앱의 sortBy 중복 제거).
 */
export function sortBy<T>(
  items: readonly T[],
  pick: (item: T) => number | string | null | undefined,
  dir: SortDir = 'asc'
): T[] {
  return items
    .map((item, index) => ({ item, index, key: pick(item) }))
    .sort((a, b) => {
      const cmp = compareNullsLast(a.key, b.key, dir);
      return cmp !== 0 ? cmp : a.index - b.index;
    })
    .map((x) => x.item);
}
