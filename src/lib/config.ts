/**
 * Runtime API config from Vite env (set in `.env` locally or Vercel project settings).
 * Never render these values in the UI.
 */
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? '/api'
).replace(/\/$/, '')

export const API_ORIGIN = (
  import.meta.env.VITE_API_ORIGIN ??
  (API_BASE_URL.startsWith('http') ? API_BASE_URL : '')
).replace(/\/$/, '')
