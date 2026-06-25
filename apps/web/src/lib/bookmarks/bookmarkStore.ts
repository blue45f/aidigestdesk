import { createBookmarkStore } from '@aidigestdesk/content/shared'

import type { AppRoute } from '@/components/app/appRoutes'

// 토스와 공유하는 createBookmarkStore 메커니즘 위에 웹 타입·정렬만 얹는다(중복 제거).
// localStorage 기반. DB 백엔드 도입 시 createBookmarkStore 를 원격 어댑터로 교체하면 됨.

const STORAGE_KEY = 'aidigestdesk.bookmarks.v1'

/** 북마크 가능한 콘텐츠 종류. 새 종류를 붙일 때 라벨/배지 매핑만 늘리면 된다. */
export type BookmarkKind = 'model' | 'benchmark' | 'deal' | 'resource'

export type Bookmark = {
  /** 종류+원본 id를 합친 전역 고유 키. */
  id: string
  kind: BookmarkKind
  /** 표시용 제목. */
  title: string
  /** 부가 설명(제공사/분야 등). */
  subtitle?: string
  /** 이동할 라우트(클릭 시 해당 페이지로). */
  route: AppRoute
  /** 라우트 내 anchor(#id). 있으면 라우트 뒤에 붙는다. */
  anchor?: string
  /** 외부 링크. route 대신 새 탭으로 연다. */
  href?: string
  /** 저장 시각(ISO). 최신순 정렬에 사용. */
  savedAt: string
}

function makeId(kind: BookmarkKind, sourceId: string): string {
  return `${kind}:${sourceId}`
}

const store = createBookmarkStore<Bookmark>(
  STORAGE_KEY,
  (bookmark) => bookmark.id,
  (value): value is Bookmark =>
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Bookmark).id === 'string' &&
    typeof (value as Bookmark).title === 'string'
)

export function listBookmarks(): Bookmark[] {
  // 저장 시각 내림차순. 동률(같은 ms)이면 나중에 추가된 항목(배열 앞)을 먼저 보여준다.
  return store
    .getSnapshot()
    .map((bookmark, index) => ({ bookmark, index }))
    .toSorted((a, b) => b.bookmark.savedAt.localeCompare(a.bookmark.savedAt) || a.index - b.index)
    .map((entry) => entry.bookmark)
}

export function isBookmarked(kind: BookmarkKind, sourceId: string): boolean {
  return store.has(makeId(kind, sourceId))
}

/** 북마크를 토글한다. 추가되면 true, 제거되면 false를 반환한다. */
export function toggleBookmark(
  input: Omit<Bookmark, 'id' | 'savedAt'> & { sourceId: string }
): boolean {
  const { sourceId, ...rest } = input
  return store.toggle({
    ...rest,
    id: makeId(input.kind, sourceId),
    savedAt: new Date().toISOString(),
  })
}

export function removeBookmark(id: string): void {
  store.remove(id)
}

export function clearBookmarks(): void {
  store.clear()
}

/** 북마크 변경(이 탭의 토글 또는 다른 탭의 storage 이벤트)을 구독한다. */
export function subscribeBookmarks(listener: () => void): () => void {
  return store.subscribe(listener)
}
