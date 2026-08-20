import {
  API_BASE_URL,
  API_ORIGIN,
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

const ACCESS_KEY = 'assis.accessToken'
const REFRESH_KEY = 'assis.refreshToken'

export function getAccessToken(): string | null {
  return sessionStorage.getItem(ACCESS_KEY)
}

export function getRefreshToken(): string | null {
  return sessionStorage.getItem(REFRESH_KEY)
}

export function persistTokens(tokens: {
  accessToken: string
  refreshToken: string
}): void {
  sessionStorage.setItem(ACCESS_KEY, tokens.accessToken)
  sessionStorage.setItem(REFRESH_KEY, tokens.refreshToken)
}

export function clearTokens(): void {
  sessionStorage.removeItem(ACCESS_KEY)
  sessionStorage.removeItem(REFRESH_KEY)
}

export function oauthUrl(
  provider: 'google' | 'microsoft',
  fromPath = '/home',
): string {
  const from = `${window.location.origin}${fromPath}`
  const params = new URLSearchParams({
    platform: 'web',
    from,
  })
  return `${API_ORIGIN}/clients/auth/oauth/${provider}?${params.toString()}`
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

export function loginWithGoogleIdToken(idToken: string) {
  return apiRequest<ClientTokenResponse>('/clients/auth/oauth/google', {
    method: 'POST',
    auth: false,
    body: { idToken },
  })
}

export function exchangeOAuthCode(code: string) {
  return apiRequest<ClientTokenResponse>('/clients/auth/oauth/exchange', {
    method: 'POST',
    auth: false,
    body: { code },
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
