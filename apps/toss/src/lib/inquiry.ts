// 문의(Inquiry) 클라이언트 — 계약·fetch 로직은 @aidigestdesk/content/shared 로 공유(웹과 동일).
// 여기선 토스 앱의 baseUrl(env)·appId만 주입한다. 같은 APP_ID라 웹/토스 문의가 한 보드로 합쳐진다.
import {
  listInquiries as sharedListInquiries,
  submitInquiry as sharedSubmitInquiry,
} from '@aidigestdesk/content/shared';

export type {
  Inquiry,
  InquiryCategory,
  InquiryList,
  InquiryStatus,
  SubmitInquiryInput,
} from '@aidigestdesk/content/shared';
export {
  INQUIRY_CATEGORIES,
  INQUIRY_CATEGORY_LABELS,
  INQUIRY_STATUS_LABELS,
} from '@aidigestdesk/content/shared';

import type { Inquiry, InquiryList, SubmitInquiryInput } from '@aidigestdesk/content/shared';

const BASE = (import.meta.env.VITE_DESK_PLATFORM_URL as string | undefined) ?? 'https://desk-platform.vercel.app';
export const APP_ID = 'aidigestdesk';

export function submitInquiry(input: SubmitInquiryInput): Promise<Inquiry> {
  return sharedSubmitInquiry(BASE, APP_ID, input);
}
export function listInquiries(limit = 20, offset = 0): Promise<InquiryList> {
  return sharedListInquiries(BASE, APP_ID, limit, offset);
}
