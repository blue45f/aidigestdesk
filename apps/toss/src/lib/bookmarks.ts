import {
  createBookmarkStore,
  createFavoritesRemote,
  getMemberId,
} from '@aidigestdesk/content/shared';
import { useSyncExternalStore } from 'react';

// 즐겨찾기 — 웹과 공유하는 createBookmarkStore 메커니즘 위에 토스 타입만 주입(중복 제거).
// 오프라인-퍼스트: localStorage 즉시 + desk-platform favorites(DB) 동기화(웹과 같은 owner면 기기 간 공유).

export type BookmarkType = 'model' | 'extension' | 'manual';
export interface Bookmark {
  type: BookmarkType;
  id: string;
  title: string;
  subtitle?: string;
  route: string;
}

/** desk-platform 공개 favorites REST — 문의(lib/inquiry)와 동일 base·appId. */
const DESK_PLATFORM_URL = import.meta.env.VITE_DESK_PLATFORM_URL ?? 'https://desk-platform.vercel.app';
const APP_ID = 'aidigestdesk';

const store = createBookmarkStore<Bookmark>(
  'aid-bookmarks',
  (b) => `${b.type}:${b.id}`,
  undefined,
  createFavoritesRemote<Bookmark>(DESK_PLATFORM_URL, APP_ID, getMemberId())
);

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
