import { createBookmarkStore } from '@aidigestdesk/content/shared';
import { useSyncExternalStore } from 'react';

// 즐겨찾기 — 웹과 공유하는 createBookmarkStore 메커니즘 위에 토스 타입만 주입(중복 제거).
// localStorage 기반. 모델/확장/매뉴얼을 저장해 /saved 에서 모아본다. 서버 의존 없음.
// (DB 백엔드 도입 시 createBookmarkStore 를 원격 어댑터로 교체하면 소비처 무변경.)

export type BookmarkType = 'model' | 'extension' | 'manual';
export interface Bookmark {
  type: BookmarkType;
  id: string;
  title: string;
  subtitle?: string;
  route: string;
}

const store = createBookmarkStore<Bookmark>('aid-bookmarks', (b) => `${b.type}:${b.id}`);

export function getBookmarks(): Bookmark[] {
  return store.getSnapshot();
}
export function isBookmarked(type: BookmarkType, id: string): boolean {
  return store.has(`${type}:${id}`);
}
export function toggleBookmark(item: Bookmark): boolean {
  return store.toggle(item);
}
export function removeBookmark(type: BookmarkType, id: string): void {
  store.remove(`${type}:${id}`);
}

export function useBookmarks(): Bookmark[] {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}
export function useIsBookmarked(type: BookmarkType, id: string): boolean {
  return useSyncExternalStore(
    store.subscribe,
    () => store.has(`${type}:${id}`),
    () => false
  );
}
