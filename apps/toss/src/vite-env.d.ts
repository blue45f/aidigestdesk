/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_DESK_PLATFORM_URL?: string;
  readonly VITE_AIDIGEST_API_URL?: string;
  readonly VITE_TOSS_AD_GROUP_FEED?: string;
  readonly VITE_TOSS_AD_GROUP_DETAIL?: string;
}
interface ImportMeta { readonly env: ImportMetaEnv }
