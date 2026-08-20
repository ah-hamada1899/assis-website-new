/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  clearTokens,
  confirmPasswordReset as confirmPasswordResetRequest,
  getAccessToken,
  getMe,
  getRefreshToken,
  login as loginRequest,
  loginWithOtp as loginWithOtpRequest,
  logout as logoutRequest,
  persistAccessToken,
  persistTokens,
  refreshSession,
  register as registerRequest,
  requestEmailVerification,
  requestOtp as requestOtpRequest,
  requestPasswordResetEmail as requestPasswordResetEmailRequest,
  requestPasswordResetOtp as requestPasswordResetOtpRequest,
  signupWithPhone as signupWithPhoneRequest,
  startPhoneAuth as startPhoneAuthRequest,
  stripAuthSearchParams,
  verifyEmail,
  verifyPasswordReset as verifyPasswordResetRequest,
  verifyPhoneAuth as verifyPhoneAuthRequest,
} from '../lib/api'
import { ApiError } from '../lib/types'
import type {
  Client,
  EmailVerificationHint,
  OtpHint,
  PhoneAuthStart,
  ResetTokenResponse,
} from '../lib/types'

type AuthContextValue = {
  client: Client | null
  ready: boolean
  emailHint: EmailVerificationHint | null
  oauthError: string | null
  clearOauthError: () => void
  signIn: (identifier: string, password: string) => Promise<Client>
  signInWithOtp: (phone: string, code: string) => Promise<Client>
  signUp: (input: {
    fullName: string
    email: string
    password: string
  }) => Promise<Client>
  signUpWithPhone: (input: {
    phone: string
    code: string
    fullName: string
  }) => Promise<Client>
  requestPhoneOtp: (
    phone: string,
    purpose: 'signup' | 'login',
  ) => Promise<OtpHint>
  startPhoneAuth: (phone: string) => Promise<PhoneAuthStart>
  verifyPhoneAuth: (input: {
    phone: string
    code: string
    fullName?: string
  }) => Promise<Client>
  signOut: () => Promise<void>
  confirmEmail: (code: string) => Promise<Client>
  resendEmailCode: () => Promise<EmailVerificationHint>
  requestPasswordResetByPhone: (phone: string) => Promise<OtpHint>
  requestPasswordResetByEmail: (email: string) => Promise<OtpHint>
  verifyPasswordReset: (input: {
    channel: 'phone' | 'email'
    code: string
    phone?: string
    email?: string
  }) => Promise<ResetTokenResponse>
  confirmPasswordReset: (
    resetToken: string,
    newPassword: string,
  ) => Promise<Client>
  refreshProfile: () => Promise<Client | null>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function applyTokens(
  tokens: {
    accessToken: string
    refreshToken?: string | null
    client: Client
  },
  setClient: (client: Client) => void,
) {
  persistTokens(tokens)
  setClient(tokens.client)
  return tokens.client
}

async function restoreStoredSession(): Promise<Client | null> {
  const accessToken = getAccessToken()
  if (!accessToken) return null

  const refreshToken = getRefreshToken()
  if (refreshToken) {
    try {
      const tokens = await refreshSession(refreshToken)
      persistTokens(tokens)
      return tokens.client
    } catch {
      // Fall through to Bearer getMe.
    }
  }

  return getMe(accessToken)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<Client | null>(null)
  const [ready, setReady] = useState(false)
  const [emailHint, setEmailHint] = useState<EmailVerificationHint | null>(
    null,
  )
  const [oauthError, setOauthError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    void (async () => {
      const params = new URLSearchParams(window.location.search)
      const queryToken = params.get('accessToken')
      const queryError = params.get('error')

      if (queryError) {
        clearTokens()
        stripAuthSearchParams()
        if (!cancelled) {
          setOauthError(queryError)
          setClient(null)
          setReady(true)
        }
        return
      }

      if (queryToken) {
        persistAccessToken(queryToken)
        stripAuthSearchParams()
        try {
          const profile = await getMe(queryToken)
          if (!cancelled) {
            setClient(profile)
            setOauthError(null)
            setEmailHint(null)
          }
        } catch {
          clearTokens()
          if (!cancelled) {
            setClient(null)
            setOauthError('Could not complete Google sign-in.')
          }
        } finally {
          if (!cancelled) setReady(true)
        }
        return
      }

      try {
        const restored = await restoreStoredSession()
        if (!cancelled) setClient(restored)
      } catch (error) {
        clearTokens()
        if (!cancelled) {
          setClient(null)
          if (!(error instanceof ApiError && error.status === 401)) {
            // Stay logged out on restore failure.
          }
        }
      } finally {
        if (!cancelled) setReady(true)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const clearOauthError = useCallback(() => {
    setOauthError(null)
  }, [])

  const signIn = useCallback(async (identifier: string, password: string) => {
    const tokens = await loginRequest(identifier, password)
    setEmailHint(null)
    setOauthError(null)
    return applyTokens(tokens, setClient)
  }, [])

  const signInWithOtp = useCallback(async (phone: string, code: string) => {
    const tokens = await loginWithOtpRequest(phone, code)
    setEmailHint(null)
    setOauthError(null)
    return applyTokens(tokens, setClient)
  }, [])

  const signUp = useCallback(
    async (input: { fullName: string; email: string; password: string }) => {
      const tokens = await registerRequest(input)
      setEmailHint(
        tokens.emailVerification
          ? { expiresAt: tokens.emailVerification.expiresAt }
          : null,
      )
      setOauthError(null)
      return applyTokens(tokens, setClient)
    },
    [],
  )

  const signUpWithPhone = useCallback(
    async (input: { phone: string; code: string; fullName: string }) => {
      const tokens = await signupWithPhoneRequest(input)
      setEmailHint(null)
      setOauthError(null)
      return applyTokens(tokens, setClient)
    },
    [],
  )

  const requestPhoneOtp = useCallback(
    (phone: string, purpose: 'signup' | 'login') =>
      requestOtpRequest(phone, purpose),
    [],
  )

  const startPhoneAuth = useCallback(
    (phone: string) => startPhoneAuthRequest(phone),
    [],
  )

  const verifyPhoneAuth = useCallback(
    async (input: { phone: string; code: string; fullName?: string }) => {
      const tokens = await verifyPhoneAuthRequest(input)
      setEmailHint(null)
      setOauthError(null)
      return applyTokens(tokens, setClient)
    },
    [],
  )

  const signOut = useCallback(async () => {
    try {
      await logoutRequest()
    } catch {
      // Local session is cleared regardless of network result.
    } finally {
      clearTokens()
      setClient(null)
      setEmailHint(null)
      setOauthError(null)
    }
  }, [])

  const confirmEmail = useCallback(async (code: string) => {
    const profile = await verifyEmail(code)
    setClient(profile)
    setEmailHint(null)
    return profile
  }, [])

  const resendEmailCode = useCallback(async () => {
    const hint = await requestEmailVerification()
    const safeHint = { expiresAt: hint.expiresAt }
    setEmailHint(safeHint)
    return safeHint
  }, [])

  const requestPasswordResetByPhone = useCallback(
    (phone: string) => requestPasswordResetOtpRequest(phone),
    [],
  )

  const requestPasswordResetByEmail = useCallback(
    (email: string) => requestPasswordResetEmailRequest(email),
    [],
  )

  const verifyPasswordReset = useCallback(
    (input: {
      channel: 'phone' | 'email'
      code: string
      phone?: string
      email?: string
    }) => verifyPasswordResetRequest(input),
    [],
  )

  const confirmPasswordReset = useCallback(
    async (resetToken: string, newPassword: string) => {
      return confirmPasswordResetRequest(resetToken, newPassword)
    },
    [],
  )

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await getMe()
      setClient(profile)
      return profile
    } catch {
      clearTokens()
      setClient(null)
      return null
    }
  }, [])

  const value = useMemo(
    () => ({
      client,
      ready,
      emailHint,
      oauthError,
      clearOauthError,
      signIn,
      signInWithOtp,
      signUp,
      signUpWithPhone,
      requestPhoneOtp,
      startPhoneAuth,
      verifyPhoneAuth,
      signOut,
      confirmEmail,
      resendEmailCode,
      requestPasswordResetByPhone,
      requestPasswordResetByEmail,
      verifyPasswordReset,
      confirmPasswordReset,
      refreshProfile,
    }),
    [
      client,
      ready,
      emailHint,
      oauthError,
      clearOauthError,
      signIn,
      signInWithOtp,
      signUp,
      signUpWithPhone,
      requestPhoneOtp,
      startPhoneAuth,
      verifyPhoneAuth,
      signOut,
      confirmEmail,
      resendEmailCode,
      requestPasswordResetByPhone,
      requestPasswordResetByEmail,
      verifyPasswordReset,
      confirmPasswordReset,
      refreshProfile,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
