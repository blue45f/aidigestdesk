import { useSyncExternalStore } from 'react';

// 즐겨찾기 — localStorage 기반 경량 스토어(웹 BookmarksRail의 토스판).
// 모델/확장/매뉴얼을 저장해 /saved 에서 모아본다. 서버 의존 없음.
// (혜택('deal')은 현재 북마크 진입점이 없어 타입에서 제외 — 데드코드 방지.)

export type BookmarkType = 'model' | 'extension' | 'manual';
export interface Bookmark {
  type: BookmarkType;
  id: string;
  title: string;
  subtitle?: string;
  route: string;
}

const KEY = 'aid-bookmarks';
const listeners = new Set<() => void>();
let cache: Bookmark[] | null = null;

function read(): Bookmark[] {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as Bookmark[]) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(items: Bookmark[]): void {
  cache = items;
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* 저장 실패(프라이빗 모드 등)는 무시 — 메모리 캐시는 유지 */
  }
  for (const l of listeners) l();
}

export function getBookmarks(): Bookmark[] {
  return read();
}
export function isBookmarked(type: BookmarkType, id: string): boolean {
  return read().some((b) => b.type === type && b.id === id);
}
export function toggleBookmark(item: Bookmark): boolean {
  const items = read();
  const idx = items.findIndex((b) => b.type === item.type && b.id === item.id);
  if (idx >= 0) {
    write(items.filter((_, i) => i !== idx));
    return false;
  }
  write([item, ...items]);
  return true;
}
export function removeBookmark(type: BookmarkType, id: string): void {
  write(read().filter((b) => !(b.type === type && b.id === id)));
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

// 다른 탭/창의 변경 동기화
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) {
      cache = null;
      for (const l of listeners) l();
    }
  });
}

export function useBookmarks(): Bookmark[] {
  return useSyncExternalStore(subscribe, getBookmarks, getBookmarks);
}
export function useIsBookmarked(type: BookmarkType, id: string): boolean {
  return useSyncExternalStore(
    subscribe,
    () => isBookmarked(type, id),
    () => false
  );
}
