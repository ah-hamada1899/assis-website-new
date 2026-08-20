/**
 * Runtime API config from Vite env (`.env` locally or Vercel project settings).
 * Never render these values in the UI.
 *
 * Local: VITE_API_BASE_URL=/api (Vite proxies to VITE_DEV_PROXY_TARGET).
 * Production: relative /api has no proxy — fall back to VITE_API_ORIGIN.
 */
const rawBase = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/$/, '')

const rawOrigin = (
  import.meta.env.VITE_API_ORIGIN ??
  (rawBase.startsWith('http') ? rawBase : '')
).replace(/\/$/, '')

export const API_ORIGIN = rawOrigin

export const API_BASE_URL =
  rawBase.startsWith('http')
    ? rawBase
    : import.meta.env.PROD && rawOrigin
      ? rawOrigin
      : rawBase
