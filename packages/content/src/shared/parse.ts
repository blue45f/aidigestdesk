// 숫자/순위/메트릭 파서 — 웹·토스·토스 생성기가 공유하는 순수 함수(의존성 0).

/** 문자열에서 첫 숫자(쉼표 제거, 소수/음수 허용)를 뽑는다. 없으면 null. */
export function parseNum(raw: string | null | undefined): number | null {
  if (!raw) return null;
  const match = String(raw).replace(/,/g, '').match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

/** 랭크 라벨("#3", "Top 10", "5") → 숫자. 없으면 null. */
export function parseRank(label: string | null | undefined): number | null {
  if (!label) return null;
  const s = String(label);
  const hash = s.match(/#\s*(\d+(?:\.\d+)?)/);
  if (hash) return Number(hash[1]);
  const top = s.match(/Top\s*(\d+(?:\.\d+)?)/i);
  if (top) return Number(top[1]);
  const plain = s.match(/\d+(?:\.\d+)?/);
  return plain ? Number(plain[0]) : null;
}

/* ── 메트릭 종류 판별(웹 정렬칩 게이트·토스 생성기 공유) ─────────────
 * 같은 마커 규칙을 웹/토스/생성기가 한 소스로 쓰게 해, 마커 없는 '맨 숫자'
 * 가격/속도가 도입돼도 양쪽 정렬칩 노출이 갈리지 않게 한다. */
/** 컨텍스트 길이처럼 보이는가(숫자 + k/m/토큰). */
export function looksContext(value: string | null | undefined): boolean {
  return /^[\d.,]+\s*[kKmM]?\s*(토큰|tokens?)?$/.test(String(value ?? '').trim());
}
/** 가격처럼 보이는가(통화기호/원/무료/free//1M). */
export function looksPrice(value: string | null | undefined): boolean {
  return /[$₩]|원|무료|free|\/\s*1m/i.test(String(value ?? ''));
}
/** 속도처럼 보이는가(tok//s/초당/ms). */
export function looksSpeed(value: string | null | undefined): boolean {
  return /tok|\/s|초당|ms/i.test(String(value ?? ''));
}
