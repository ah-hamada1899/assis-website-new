import {
  API_BASE_URL,
  API_ORIGIN,
  ApiError,
  type ApiEnvelope,
  type Client,
  type ClientTokenResponse,
  type RegisterResponse,
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
  fromPath = '/account',
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

export function verifyEmail(code: string) {
  return apiRequest<Client>('/clients/auth/email/verify', {
    method: 'POST',
    body: { code },
  })
}

export function requestEmailVerification() {
  return apiRequest<{ expiresAt: string; code?: string }>(
    '/clients/auth/email/verify/request',
    { method: 'POST' },
  )
}
