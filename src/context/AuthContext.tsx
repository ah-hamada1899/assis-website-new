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
  getMe,
  getRefreshToken,
  login as loginRequest,
  logout as logoutRequest,
  persistTokens,
  refreshSession,
  register as registerRequest,
  requestEmailVerification,
  verifyEmail,
} from '../lib/api'
import type { Client, EmailVerificationHint } from '../lib/types'

type AuthContextValue = {
  client: Client | null
  ready: boolean
  emailHint: EmailVerificationHint | null
  signIn: (identifier: string, password: string) => Promise<Client>
  signUp: (input: {
    fullName: string
    email: string
    password: string
  }) => Promise<Client>
  signOut: () => Promise<void>
  confirmEmail: (code: string) => Promise<Client>
  resendEmailCode: () => Promise<EmailVerificationHint>
  refreshProfile: () => Promise<Client | null>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<Client | null>(null)
  const [ready, setReady] = useState(false)
  const [emailHint, setEmailHint] = useState<EmailVerificationHint | null>(
    null,
  )

  const applySession = useCallback(async () => {
    const tokens = await refreshSession(getRefreshToken())
    persistTokens(tokens)
    setClient(tokens.client)
    return tokens.client
  }, [])

  useEffect(() => {
    let cancelled = false

    void (async () => {
      try {
        const restored = await applySession()
        if (!cancelled) setClient(restored)
      } catch {
        try {
          const profile = await getMe()
          if (!cancelled) setClient(profile)
        } catch {
          clearTokens()
          if (!cancelled) setClient(null)
        }
      } finally {
        if (!cancelled) setReady(true)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [applySession])

  const signIn = useCallback(async (identifier: string, password: string) => {
    const tokens = await loginRequest(identifier, password)
    persistTokens(tokens)
    setClient(tokens.client)
    setEmailHint(null)
    return tokens.client
  }, [])

  const signUp = useCallback(
    async (input: { fullName: string; email: string; password: string }) => {
      const tokens = await registerRequest(input)
      persistTokens(tokens)
      setClient(tokens.client)
      setEmailHint(tokens.emailVerification ?? null)
      return tokens.client
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
    setEmailHint(hint)
    return hint
  }, [])

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await getMe()
      setClient(profile)
      return profile
    } catch {
      setClient(null)
      return null
    }
  }, [])

  const value = useMemo(
    () => ({
      client,
      ready,
      emailHint,
      signIn,
      signUp,
      signOut,
      confirmEmail,
      resendEmailCode,
      refreshProfile,
    }),
    [
      client,
      ready,
      emailHint,
      signIn,
      signUp,
      signOut,
      confirmEmail,
      resendEmailCode,
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
