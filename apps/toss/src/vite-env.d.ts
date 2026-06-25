/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_DESK_PLATFORM_URL?: string;
}
interface ImportMeta { readonly env: ImportMetaEnv }
