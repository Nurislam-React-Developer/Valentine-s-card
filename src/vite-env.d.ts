/// <reference types="vite/client" />

// Расширяем типы окружения для наших переменных VITE_*
interface ImportMetaEnv {
  readonly VITE_SPOTIFY_CLIENT_ID: string
  readonly VITE_SPOTIFY_REDIRECT_URI: string
  readonly VITE_SPOTIFY_SCOPES: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}