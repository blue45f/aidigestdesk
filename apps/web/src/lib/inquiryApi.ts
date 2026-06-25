// 문의(Inquiry) 게시판 API — desk-platform 공개 REST.
// 계약·fetch 로직은 @aidigestdesk/content/shared 로 추출(토스와 공유). 여기선 이 앱의
// baseUrl(env)·appId만 주입한다. 기존 import 경로(이 모듈)는 그대로 유지된다.
import {
  listInquiries as sharedListInquiries,
  submitInquiry as sharedSubmitInquiry,
} from '@aidigestdesk/content/shared'

import type { Inquiry, InquiryList, SubmitInquiryInput } from '@aidigestdesk/content/shared'

export type {
  Inquiry,
  InquiryCategory,
  InquiryList,
  InquiryStatus,
  SubmitInquiryInput,
} from '@aidigestdesk/content/shared'
export {
  INQUIRY_CATEGORIES,
  INQUIRY_CATEGORY_LABELS,
  INQUIRY_STATUS_LABELS,
} from '@aidigestdesk/content/shared'

const BASE = import.meta.env.VITE_DESK_PLATFORM_URL ?? 'https://desk-platform.vercel.app'

/** 이 앱의 슬러그(레포 이름). desk-platform이 앱별 게시판을 구분하는 키. */
export const APP_ID = 'aidigestdesk'

export function submitInquiry(input: SubmitInquiryInput): Promise<Inquiry> {
  return sharedSubmitInquiry(BASE, APP_ID, input)
}

export function listInquiries(limit = 20, offset = 0): Promise<InquiryList> {
  return sharedListInquiries(BASE, APP_ID, limit, offset)
}
