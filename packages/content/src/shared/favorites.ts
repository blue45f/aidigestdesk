// 즐겨찾기 원격(DB) 클라이언트 — desk-platform 공개 REST(/api/v1/apps/:appId/favorites)를
// 호출한다. createBookmarkStore 의 remote 어댑터로 주입해 오프라인-퍼스트 동기화를 만든다.
// 의존성 0. baseUrl/appId/ownerKey 는 앱이 주입(env·익명 멤버키).

import type { RemoteBookmarkAdapter } from './createBookmarkStore';

/** owner 즐겨찾기 목록 조회(GET). 실패 시 throw. */
export async function fetchFavorites<T>(
  baseUrl: string,
  appId: string,
  ownerKey: string
): Promise<T[]> {
  const url = `${baseUrl}/api/v1/apps/${appId}/favorites?ownerKey=${encodeURIComponent(ownerKey)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`favorites GET ${res.status}`);
  const data = (await res.json()) as { items?: T[] };
  return Array.isArray(data.items) ? data.items : [];
}

/** owner 즐겨찾기 전체 교체(PUT). 실패 시 throw. */
export async function putFavorites<T>(
  baseUrl: string,
  appId: string,
  ownerKey: string,
  items: T[]
): Promise<void> {
  const url = `${baseUrl}/api/v1/apps/${appId}/favorites?ownerKey=${encodeURIComponent(ownerKey)}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ items }),
  });
  if (!res.ok) throw new Error(`favorites PUT ${res.status}`);
}

/**
 * createBookmarkStore 에 주입할 원격 어댑터. env(baseUrl)가 설정됐을 때만 만든다.
 * load 실패는 null 로 흘려(로컬 캐시 유지), save 실패는 조용히 무시(오프라인-퍼스트).
 */
export function createFavoritesRemote<T>(
  baseUrl: string,
  appId: string,
  ownerKey: string
): RemoteBookmarkAdapter<T> {
  return {
    load: async () => {
      try {
        return await fetchFavorites<T>(baseUrl, appId, ownerKey);
      } catch {
        return null;
      }
    },
    save: (items) => {
      void putFavorites<T>(baseUrl, appId, ownerKey, items).catch(() => {});
    },
  };
}
