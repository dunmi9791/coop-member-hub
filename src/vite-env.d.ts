/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  /** Odoo database members log in to (baked in at build time). */
  readonly VITE_ODOO_DB?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
