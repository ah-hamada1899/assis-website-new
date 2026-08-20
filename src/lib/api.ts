import { API_BASE_URL, API_ORIGIN } from './config'
import {
  ApiError,
  type ApiEnvelope,
  type Client,
  type ClientMobileTokenResponse,
  type ClientTokenResponse,
  type OtpHint,
  type PhoneAuthStart,
  type RegisterResponse,
  type ResetTokenResponse,
} from './types'

/** Web OAuth + API Bearer session (localStorage). */
const ACCESS_KEY = 'assis_access_token'
const REFRESH_KEY = 'assis_refresh_token'
/** Legacy keys from earlier sessionStorage sessions. */
const LEGACY_ACCESS_KEY = 'assis.accessToken'
const LEGACY_REFRESH_KEY = 'assis.refreshToken'

function readStorage(key: string): string | null {
  return localStorage.getItem(key) ?? sessionStorage.getItem(key)
}

export function getAccessToken(): string | null {
  return readStorage(ACCESS_KEY) ?? readStorage(LEGACY_ACCESS_KEY)
}

export function getRefreshToken(): string | null {
  return readStorage(REFRESH_KEY) ?? readStorage(LEGACY_REFRESH_KEY)
}

export function persistAccessToken(accessToken: string): void {
  localStorage.setItem(ACCESS_KEY, accessToken)
  sessionStorage.removeItem(LEGACY_ACCESS_KEY)
  sessionStorage.removeItem(ACCESS_KEY)
}

export function persistTokens(tokens: {
  accessToken: string
  refreshToken?: string | null
}): void {
  persistAccessToken(tokens.accessToken)
  if (tokens.refreshToken) {
    localStorage.setItem(REFRESH_KEY, tokens.refreshToken)
    sessionStorage.removeItem(LEGACY_REFRESH_KEY)
    sessionStorage.removeItem(REFRESH_KEY)
  }
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
  sessionStorage.removeItem(ACCESS_KEY)
  sessionStorage.removeItem(REFRESH_KEY)
  sessionStorage.removeItem(LEGACY_ACCESS_KEY)
  sessionStorage.removeItem(LEGACY_REFRESH_KEY)
}

/**
 * Browser navigation to the API OAuth start URL.
 * Google returns to the API; the API 302s to /home?accessToken=… (or ?error=…).
 * Do not append Google callback params or call oauth/exchange.
 */
export function oauthUrl(provider: 'google' | 'microsoft'): string {
  const base = (API_ORIGIN || API_BASE_URL).replace(/\/$/, '')
  if (!base.startsWith('http')) {
    throw new Error(
      'Set VITE_API_ORIGIN (or an absolute VITE_API_BASE_URL) for OAuth.',
    )
  }
  return `${base}/clients/auth/oauth/${provider}?platform=web`
}

/** Remove OAuth/session query params from the address bar without a navigation. */
export function stripAuthSearchParams(): void {
  const url = new URL(window.location.href)
  for (const key of [
    'accessToken',
    'error',
    'code',
    'state',
    'iss',
    'scope',
    'authuser',
    'prompt',
    'hd',
  ]) {
    url.searchParams.delete(key)
  }
  const search = url.searchParams.toString()
  const next = `${url.pathname}${search ? `?${search}` : ''}${url.hash}`
  window.history.replaceState({}, '', next)
}

async function parseEnvelope<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as
    | ApiEnvelope<T>
    | null

  if (!response.ok || payload == null) {
    throw new ApiError(
      payload?.message ?? `Request failed (${response.status})`,
      response.status,
      payload?.code,
    )
  }

  return payload.data
}

type RequestOptions = {
  method?: string
  body?: unknown
  auth?: boolean
  token?: string | null
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  const token = options.token ?? (options.auth === false ? null : getAccessToken())
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    credentials: 'include',
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })

  return parseEnvelope<T>(response)
}

// --- Email / password (web) ---

export function login(identifier: string, password: string) {
  return apiRequest<ClientTokenResponse>('/clients/auth/login', {
    method: 'POST',
    auth: false,
    body: { identifier, password },
  })
}

export function register(input: {
  fullName: string
  email: string
  password: string
}) {
  return apiRequest<RegisterResponse>('/clients/auth/register', {
    method: 'POST',
    auth: false,
    body: input,
  })
}

// --- Phone OTP (explicit purpose) ---

export function requestOtp(phone: string, purpose: 'signup' | 'login') {
  return apiRequest<OtpHint>('/clients/auth/otp/request', {
    method: 'POST',
    auth: false,
    body: { phone, purpose },
  })
}

export function signupWithPhone(input: {
  phone: string
  code: string
  fullName: string
}) {
  return apiRequest<ClientTokenResponse>('/clients/auth/signup', {
    method: 'POST',
    auth: false,
    body: input,
  })
}

export function loginWithOtp(phone: string, code: string) {
  return apiRequest<ClientTokenResponse>('/clients/auth/login/otp', {
    method: 'POST',
    auth: false,
    body: { phone, code },
  })
}

// --- Unified phone entry (auto signup or login) ---

export function startPhoneAuth(phone: string) {
  return apiRequest<PhoneAuthStart>('/clients/auth/phone', {
    method: 'POST',
    auth: false,
    body: { phone },
  })
}

export function verifyPhoneAuth(input: {
  phone: string
  code: string
  fullName?: string
}) {
  return apiRequest<ClientTokenResponse>('/clients/auth/phone/verify', {
    method: 'POST',
    auth: false,
    body: input,
  })
}

// --- Mobile-only token endpoints (available for API testing) ---

export function loginMobile(identifier: string, password: string) {
  return apiRequest<ClientMobileTokenResponse>('/clients/auth/login/mobile', {
    method: 'POST',
    auth: false,
    body: { identifier, password },
  })
}

export function loginMobilePhone(input: {
  phone: string
  password: string
  code: string
}) {
  return apiRequest<ClientMobileTokenResponse>(
    '/clients/auth/login/mobile/phone',
    {
      method: 'POST',
      auth: false,
      body: input,
    },
  )
}

/** Native apps only — web Google sign-in must use GET oauth redirect, not this. */
export function loginWithGoogleIdToken(idToken: string) {
  return apiRequest<ClientTokenResponse>('/clients/auth/oauth/google', {
    method: 'POST',
    auth: false,
    body: { idToken },
  })
}

// --- Session ---

export function refreshSession(refreshToken?: string | null) {
  return apiRequest<ClientTokenResponse>('/clients/auth/refresh', {
    method: 'POST',
    auth: false,
    body: refreshToken ? { refreshToken } : {},
  })
}

export function logout() {
  return apiRequest<null>('/clients/auth/logout', {
    method: 'POST',
  })
}

export function getMe(token?: string | null) {
  return apiRequest<Client>('/clients/me', {
    token: token ?? getAccessToken(),
  })
}

// --- Email verification ---

export function verifyEmail(code: string) {
  return apiRequest<Client>('/clients/auth/email/verify', {
    method: 'POST',
    body: { code },
  })
}

export function requestEmailVerification() {
  return apiRequest<OtpHint>('/clients/auth/email/verify/request', {
    method: 'POST',
  })
}

// --- Password reset ---

export function requestPasswordResetOtp(phone: string) {
  return apiRequest<OtpHint>('/clients/auth/password/reset/otp', {
    method: 'POST',
    auth: false,
    body: { phone },
  })
}

export function requestPasswordResetEmail(email: string) {
  return apiRequest<OtpHint>('/clients/auth/password/reset/email', {
    method: 'POST',
    auth: false,
    body: { email },
  })
}

export function verifyPasswordReset(input: {
  channel: 'phone' | 'email'
  code: string
  phone?: string
  email?: string
}) {
  return apiRequest<ResetTokenResponse>(
    '/clients/auth/password/reset/verify',
    {
      method: 'POST',
      auth: false,
      body: input,
    },
  )
}

export function confirmPasswordReset(resetToken: string, newPassword: string) {
  return apiRequest<Client>('/clients/auth/password/reset/confirm', {
    method: 'POST',
    auth: false,
    body: { resetToken, newPassword },
  })
}
