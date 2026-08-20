export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? '/api'

export const API_ORIGIN =
  import.meta.env.VITE_API_ORIGIN ?? 'https://assis-api-staging.ellwaa.com'

export type ClientProvider = 'phone' | 'google' | 'microsoft' | 'local'

export type Client = {
  id: string
  businessId: string
  fullName: string
  username: string | null
  email: string | null
  primaryPhone: string | null
  secondaryPhone: string | null
  phoneVerified: boolean
  emailVerified: boolean
  avatarUrl: string | null
  provider: ClientProvider
  isActive: boolean
  lastUsernameChange: string | null
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
  profileComplete: boolean
  missing: Array<'email' | 'primaryPhone'>
}

export type ClientTokenResponse = {
  accessToken: string
  refreshToken: string
  expiresIn: number
  client: Client
}

export type ClientMobileTokenResponse = {
  accessToken: string
  expiresIn: number
  client: Client
}

export type OtpHint = {
  expiresAt: string
  code?: string
}

export type EmailVerificationHint = OtpHint

export type PhoneAuthStart = {
  expiresAt: string
  code?: string
  flow: 'signup' | 'login'
  phone: string
}

export type ResetTokenResponse = {
  resetToken: string
  expiresIn: number
}

export type RegisterResponse = ClientTokenResponse & {
  emailVerification?: EmailVerificationHint
}

export type ApiEnvelope<T> = {
  code: number
  message: string
  data: T
}

export class ApiError extends Error {
  readonly status: number
  readonly code?: number

  constructor(message: string, status: number, code?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}
