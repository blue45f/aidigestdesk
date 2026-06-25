// 즐겨찾기 스토어 제네릭 팩토리 — 웹·토스가 같은 메커니즘을 공유한다(중복 제거).
// 의존성 0(React 없음). 각 앱은 자기 Bookmark 타입·storageKey·식별키 함수를 주입하고,
// 얇은 React 훅(useSyncExternalStore)으로 감싸 쓴다. getSnapshot 은 쓰기 전까지 동일
// 참조를 돌려줘 useSyncExternalStore 무한 루프를 막는다(쓰기/크로스탭 변경 시에만 무효화).

export interface BookmarkStore<T> {
  /** 현재 항목 배열(안정 스냅샷 — useSyncExternalStore getSnapshot 으로 사용). */
  getSnapshot(): T[];
  /** 식별키가 저장돼 있는가. */
  has(key: string): boolean;
  /** 항목 토글 — 추가되면 true, 제거되면 false. */
  toggle(item: T): boolean;
  /** 식별키로 제거. */
  remove(key: string): void;
  /** 전체 비우기. */
  clear(): void;
  /** 변경 구독(해제 함수 반환). */
  subscribe(listener: () => void): () => void;
}

/**
 * @param storageKey  localStorage 키(앱별 고유)
 * @param getKey      항목 → 식별키(웹은 b.id, 토스는 `${b.type}:${b.id}` 등)
 * @param isValid     로드 시 항목 유효성 가드(손상 데이터 필터)
 */
export function createBookmarkStore<T>(
  storageKey: string,
  getKey: (item: T) => string,
  isValid: (value: unknown) => value is T = (v): v is T =>
    typeof v === 'object' && v !== null
): BookmarkStore<T> {
  const listeners = new Set<() => void>();
  // 직렬화 비교 캐시 — 매 read 마다 localStorage 를 보되, raw 문자열이 같으면 동일 배열
  // 참조를 돌려준다(useSyncExternalStore 무한 루프 방지 + 외부/직접 변경도 즉시 반영).
  let cachedRaw: string | null = null;
  let cachedValue: T[] = [];

  function read(): T[] {
    if (typeof window === 'undefined') return cachedValue;
    let raw: string;
    try {
      raw = window.localStorage.getItem(storageKey) ?? '[]';
    } catch {
      raw = '[]';
    }
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      try {
        const parsed: unknown = JSON.parse(raw);
        cachedValue = Array.isArray(parsed) ? parsed.filter(isValid) : [];
      } catch {
        cachedValue = [];
      }
    }
    return cachedValue;
  }

  function write(items: T[]): void {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(items));
      } catch {
        /* 저장 실패(프라이빗 모드 등)는 무시 — 다음 read 가 기존 값을 돌려준다 */
      }
    }
    for (const listener of listeners) listener();
  }

  if (typeof window !== 'undefined') {
    // 다른 탭 변경 — read 가 raw 비교로 감지하므로 알림만 보낸다.
    window.addEventListener('storage', (event) => {
      if (event.key === storageKey) for (const listener of listeners) listener();
    });
  }

  return {
    getSnapshot: read,
    has: (key) => read().some((item) => getKey(item) === key),
    toggle: (item) => {
      const key = getKey(item);
      const items = read();
      const idx = items.findIndex((existing) => getKey(existing) === key);
      if (idx >= 0) {
        write(items.filter((_, i) => i !== idx));
        return false;
      }
      write([item, ...items]);
      return true;
    },
    remove: (key) => write(read().filter((item) => getKey(item) !== key)),
    clear: () => write([]),
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
