/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SCHEMA_VERSION: string
  readonly VITE_SENTRY_DSN: string
  readonly VITE_PLAUSIBLE_DOMAIN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
