/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FILTER_TERM?: string;
  readonly VITE_INITIAL_COLOR?: string;
  readonly VITE_IMAGE_EXT?: string;
  readonly VITE_LINK_MODE?: string;
  readonly VITE_SITE_LABEL?: string;
  readonly VITE_SITE_TITLE?: string;
  readonly VITE_SITE_DESCRIPTION?: string;
  readonly VITE_SITE_URL?: string;
  readonly VITE_OG_IMAGE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
