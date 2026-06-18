/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** AuthDesk 엔드포인트(예: https://host/auth). 설정 시 회원 인증을 DeskCloud로 위임. */
  readonly VITE_AUTHDESK_URL?: string
  /** AuthDesk publishable 키(pk_…). */
  readonly VITE_AUTHDESK_PK?: string
  /** CommunityDesk 엔드포인트(예: https://host/community). 설정 시 게시판·카페를 DeskCloud로 위임. */
  readonly VITE_COMMUNITYDESK_URL?: string
  /** CommunityDesk publishable 키(pk_…). */
  readonly VITE_COMMUNITYDESK_PK?: string
  /** TermsDesk 엔드포인트(예: https://host/terms). 설정 시 약관을 TermsDesk에서 게시본으로 로드. */
  readonly VITE_TERMSDESK_URL?: string
  /** TermsDesk publishable 키(pk_…). */
  readonly VITE_TERMSDESK_PK?: string
  /** TermsDesk 공개 렌더 라우트용 조직 slug. */
  readonly VITE_TERMSDESK_ORG?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
