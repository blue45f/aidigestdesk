// 웹(apps/web)·토스(apps/toss)가 공유하는 순수 로직·계약.
// 의존성 없음(카탈로그/데이터 import 금지, import.meta 사용 금지 — tsup CJS 안전).
// 별도 엔트리(@aidigestdesk/content/shared)로 빌드돼 토스가 카탈로그 번들 없이 가져다 쓴다.

/* ── 숫자/순위 파서 ─────────────────────────────────────────────── */

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

/* ── 문의(Inquiry) 계약 + 클라이언트 ─────────────────────────────── */
// desk-platform 공개 REST(/api/v1/apps/:appId/inquiries)를 직접 호출한다.
// baseUrl/appId는 호출하는 앱이 주입한다(env 접근은 앱 소스에 둔다).

export type InquiryCategory = 'partnership' | 'bug' | 'feedback' | 'usage';
export type InquiryStatus = 'new' | 'in_progress' | 'resolved' | 'closed';

export const INQUIRY_CATEGORIES: InquiryCategory[] = ['partnership', 'bug', 'feedback', 'usage'];
export const INQUIRY_CATEGORY_LABELS: Record<InquiryCategory, string> = {
  partnership: '제휴 문의',
  bug: '버그 신고',
  feedback: '사이트 의견',
  usage: '이용 문의',
};
export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  new: '접수',
  in_progress: '처리 중',
  resolved: '해결됨',
  closed: '종료',
};

export type Inquiry = {
  id: string;
  appId: string;
  category: InquiryCategory;
  status: InquiryStatus;
  title: string;
  body: string;
  authorName: string | null;
  createdAt: string;
  updatedAt: string;
};
export type InquiryList = {
  appId: string;
  items: Inquiry[];
  limit: number;
  offset: number;
};
export type SubmitInquiryInput = {
  category: InquiryCategory;
  title: string;
  body: string;
  contactEmail?: string;
  authorName?: string;
};

async function readErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const data = (await res.json()) as { message?: string | string[] };
    if (Array.isArray(data.message)) return data.message.join(', ');
    if (typeof data.message === 'string' && data.message.trim()) return data.message;
  } catch {
    /* 본문 없음/깨짐 → 폴백 */
  }
  return fallback;
}

/** 문의 등록(POST, 10/min/IP). 허니팟 website는 항상 빈 값, originUrl 자동 첨부. */
export async function submitInquiry(
  baseUrl: string,
  appId: string,
  input: SubmitInquiryInput
): Promise<Inquiry> {
  const res = await fetch(`${baseUrl}/api/v1/apps/${appId}/inquiries`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      ...input,
      originUrl: typeof location !== 'undefined' ? location.href : undefined,
      website: '',
    }),
  });
  if (!res.ok) throw new Error(await readErrorMessage(res, '문의 등록에 실패했습니다.'));
  return (await res.json()) as Inquiry;
}

/** 공개 목록 최신순(GET, 60/min/IP). limit 1~50. */
export async function listInquiries(
  baseUrl: string,
  appId: string,
  limit = 20,
  offset = 0
): Promise<InquiryList> {
  const safeLimit = Math.min(Math.max(Math.trunc(limit), 1), 50);
  const safeOffset = Math.max(Math.trunc(offset), 0);
  const res = await fetch(`${baseUrl}/api/v1/apps/${appId}/inquiries?limit=${safeLimit}&offset=${safeOffset}`);
  if (!res.ok) throw new Error(await readErrorMessage(res, '문의 목록을 불러오지 못했습니다.'));
  return (await res.json()) as InquiryList;
}
