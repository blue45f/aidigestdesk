// @aidigestdesk/content/shared — 웹(apps/web)·토스(apps/toss)가 공유하는 순수 로직·계약.
// 의존성 0(카탈로그/데이터 import 금지, import.meta 금지 — tsup CJS 안전). 별도 엔트리로
// 빌드돼 토스가 거대 catalog 번들 없이 가져다 쓴다.
//
// 폴더 구조(편집 한 번 = 웹·토스 동시 반영):
//   parse     — 숫자/순위/메트릭 파서
//   inquiry   — 문의 계약 + REST 클라이언트
//   community — 채팅/게시판/카페 localStorage 스토어(웹·토스 공용)

export * from './parse';
export * from './time';
export * from './sort';
export * from './inquiry';
export * from './community';
