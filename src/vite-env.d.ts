/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FILTER_TERM?: string;
  readonly VITE_SITE_TITLE?: string;
  readonly VITE_SITE_DESCRIPTION?: string;
  readonly VITE_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
