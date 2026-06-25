// 문의(Inquiry) 클라이언트 — 웹과 동일하게 desk-platform 공개 REST를 직접 호출한다.
// 같은 APP_ID('aidigestdesk')라 웹/토스 문의가 하나의 게시판으로 합쳐진다.
// 계약: desk-platform /api/v1/apps/:appId/inquiries (apps/web/src/lib/inquiryApi.ts와 동일).

const BASE = (import.meta.env.VITE_DESK_PLATFORM_URL as string | undefined) ?? 'https://desk-platform.vercel.app';
export const APP_ID = 'aidigestdesk';

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

export interface Inquiry {
  id: string;
  appId: string;
  category: InquiryCategory;
  status: InquiryStatus;
  title: string;
  body: string;
  authorName: string | null;
  createdAt: string;
  updatedAt: string;
}
export interface InquiryList {
  appId: string;
  items: Inquiry[];
  limit: number;
  offset: number;
}
export interface SubmitInquiryInput {
  category: InquiryCategory;
  title: string;
  body: string;
  contactEmail?: string;
  authorName?: string;
}

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

/** 문의 등록(POST, 10/min/IP). 허니팟 website는 항상 빈 값. */
export async function submitInquiry(input: SubmitInquiryInput): Promise<Inquiry> {
  const res = await fetch(`${BASE}/api/v1/apps/${APP_ID}/inquiries`, {
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
export async function listInquiries(limit = 20, offset = 0): Promise<InquiryList> {
  const safeLimit = Math.min(Math.max(Math.trunc(limit), 1), 50);
  const safeOffset = Math.max(Math.trunc(offset), 0);
  const res = await fetch(`${BASE}/api/v1/apps/${APP_ID}/inquiries?limit=${safeLimit}&offset=${safeOffset}`);
  if (!res.ok) throw new Error(await readErrorMessage(res, '문의 목록을 불러오지 못했습니다.'));
  return (await res.json()) as InquiryList;
}
