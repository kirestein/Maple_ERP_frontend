/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL_DEV: string
  readonly VITE_API_URL_PROD: string
  readonly VITE_APP_ENVIRONMENT: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_API_EMPLOYEES_ENDPOINT: string
  readonly VITE_API_HEALTH_ENDPOINT: string
  readonly VITE_API_TEMPLATE_ENDPOINT: string
  readonly VITE_MAX_FILE_SIZE: string
  readonly VITE_ALLOWED_FILE_TYPES: string
  readonly VITE_DEFAULT_PAGE_SIZE: string
  readonly VITE_MAX_PAGE_SIZE: string
  readonly VITE_DEFAULT_LANGUAGE: string
  readonly VITE_DATE_FORMAT: string
  readonly VITE_CURRENCY: string
  readonly VITE_ENABLE_DEBUG_LOGS: string
  readonly VITE_ENABLE_MOCK_DATA: string
  readonly VITE_ENABLE_HTTPS_ONLY: string
  readonly VITE_SESSION_TIMEOUT: string
  readonly VITE_ENABLE_HEALTH_CHECK: string
  readonly VITE_ENABLE_EXPORT_FEATURES: string
  readonly VITE_ENABLE_BADGE_GENERATION: string
  readonly VITE_ENABLE_MULTIPLE_BADGE_GENERATION: string
  readonly VITE_DEFAULT_ERROR_MESSAGE: string
  readonly VITE_NETWORK_ERROR_MESSAGE: string
  readonly VITE_SERVER_ERROR_MESSAGE: string
  readonly VITE_LOADING_TIMEOUT: string
  readonly VITE_REQUEST_TIMEOUT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
