/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_MOCK_API?: string
  readonly VITE_API_BASE_URL?: string
  readonly VITE_SIMULATE_FORM_ERROR?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
