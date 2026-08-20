import { type FormEvent, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AuthCard, AuthShell } from '../components/auth/AuthCard'
import { Divider, SocialAuth } from '../components/auth/SocialAuth'
import { Button } from '../components/ui/Button'
import { TextField } from '../components/ui/TextField'
import { useAuth } from '../context/AuthContext'
import {
  emailVerifySchema,
  fieldErrorsFromZod,
  phoneSchema,
  phoneSignupSchema,
  phoneOtpSchema,
  signInSchema,
  signUpSchema,
} from '../lib/auth-schemas'
import { ApiError } from '../lib/types'
import { cn } from '../lib/cn'

type AuthMethod = 'email' | 'phone'

function MethodTabs({
  method,
  onChange,
}: {
  method: AuthMethod
  onChange: (next: AuthMethod) => void
}) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg bg-surface-low p-1">
      {([
        ['email', 'Email'],
        ['phone', 'Phone OTP'],
      ] as const).map(([value, label]) => (
        <button
          key={value}
          type="button"
          className={cn(
            'h-10 rounded-md text-[14px] font-semibold tracking-[0.01em] transition-colors',
            method === value
              ? 'bg-surface-lowest text-on-surface shadow-lift dark:bg-[#2a2a2a]'
              : 'text-on-surface-variant hover:text-on-surface',
          )}
          onClick={() => onChange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

function FormError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="text-[14px] font-medium leading-5 text-error">{message}</p>
  )
}

export function SignInPage() {
  const {
    client,
    ready,
    signIn,
    signInWithOtp,
    requestPhoneOtp,
    startPhoneAuth,
    verifyPhoneAuth,
    oauthError,
    clearOauthError,
  } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    (location.state as { from?: string } | null)?.from ?? '/home'

  const [method, setMethod] = useState<AuthMethod>('email')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [fullName, setFullName] = useState('')
  const [phoneStep, setPhoneStep] = useState<'start' | 'verify'>('start')
  const [phoneFlow, setPhoneFlow] = useState<'login' | 'signup' | null>(null)
  const [phoneMode, setPhoneMode] = useState<'explicit' | 'auto'>('explicit')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  if (ready && client) {
    return <Navigate to={from} replace />
  }

  async function onEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = signInSchema.safeParse({ identifier, password })
    if (!parsed.success) {
      setErrors(fieldErrorsFromZod(parsed.error))
      return
    }

    setErrors({})
    setSubmitting(true)
    try {
      await signIn(parsed.data.identifier, parsed.data.password)
      navigate(from, { replace: true })
    } catch (error) {
      setErrors({
        form:
          error instanceof ApiError
            ? error.message
            : 'Could not sign in. Please try again.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  async function onPhoneStart(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = phoneSchema.safeParse({ phone })
    if (!parsed.success) {
      setErrors(fieldErrorsFromZod(parsed.error))
      return
    }

    setErrors({})
    setSubmitting(true)
    try {
      if (phoneMode === 'auto') {
        const started = await startPhoneAuth(parsed.data.phone)
        setPhone(started.phone)
        setPhoneFlow(started.flow)
      } else {
        await requestPhoneOtp(parsed.data.phone, 'login')
        setPhoneFlow('login')
      }
      setPhoneStep('verify')
    } catch (error) {
      setErrors({
        form:
          error instanceof ApiError
            ? error.message
            : 'Could not send the login code.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  async function onPhoneVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const needsName = phoneFlow === 'signup'

    if (needsName) {
      const parsed = phoneSignupSchema.safeParse({ phone, code, fullName })
      if (!parsed.success) {
        setErrors(fieldErrorsFromZod(parsed.error))
        return
      }

      setErrors({})
      setSubmitting(true)
      try {
        if (phoneMode === 'auto') {
          await verifyPhoneAuth(parsed.data)
        } else {
          await signInWithOtp(parsed.data.phone, parsed.data.code)
        }
        navigate(from, { replace: true })
      } catch (error) {
        setErrors({
          form:
            error instanceof ApiError
              ? error.message
              : 'Could not verify the phone code.',
        })
      } finally {
        setSubmitting(false)
      }
      return
    }

    const parsed = phoneOtpSchema.safeParse({ phone, code })
    if (!parsed.success) {
      setErrors(fieldErrorsFromZod(parsed.error))
      return
    }

    setErrors({})
    setSubmitting(true)
    try {
      if (phoneMode === 'auto') {
        await verifyPhoneAuth(parsed.data)
      } else {
        await signInWithOtp(parsed.data.phone, parsed.data.code)
      }
      navigate(from, { replace: true })
    } catch (error) {
      setErrors({
        form:
          error instanceof ApiError
            ? error.message
            : 'Could not verify the phone code.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell>
      <AuthCard
        title="Welcome back"
        subtitle="Sign in with email/password, phone OTP, or a social provider."
      >
        {oauthError ? (
          <div className="mb-6 flex flex-col gap-2 rounded-lg bg-error-container px-4 py-3">
            <p className="text-[14px] font-medium leading-5 text-on-error-container">
              {oauthError}
            </p>
            <button
              type="button"
              className="self-start text-[13px] font-semibold text-on-error-container underline"
              onClick={clearOauthError}
            >
              Dismiss
            </button>
          </div>
        ) : null}
        <MethodTabs method={method} onChange={setMethod} />

        {method === 'email' ? (
          <form className="flex flex-col gap-6" onSubmit={onEmailSubmit} noValidate>
            <TextField
              label="Email or username"
              name="identifier"
              autoComplete="username"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              error={errors.identifier}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              error={errors.password}
            />
            <FormError message={errors.form} />
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>
            <p className="text-center text-[14px] leading-5 text-on-surface-variant">
              <Link
                className="font-semibold text-secondary-action hover:brightness-110"
                to="/forgot-password"
              >
                Forgot password?
              </Link>
            </p>
          </form>
        ) : phoneStep === 'start' ? (
          <form className="flex flex-col gap-6" onSubmit={onPhoneStart} noValidate>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={phoneMode === 'explicit' ? 'secondary' : 'ghost'}
                className="h-10"
                onClick={() => setPhoneMode('explicit')}
              >
                Login OTP
              </Button>
              <Button
                type="button"
                variant={phoneMode === 'auto' ? 'secondary' : 'ghost'}
                className="h-10"
                onClick={() => setPhoneMode('auto')}
              >
                Auto detect
              </Button>
            </div>
            <TextField
              label="Phone number"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+201012345678"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              error={errors.phone}
            />
            <FormError message={errors.form} />
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Sending code…' : 'Send code'}
            </Button>
          </form>
        ) : (
          <form className="flex flex-col gap-6" onSubmit={onPhoneVerify} noValidate>
            <TextField
              label="Phone number"
              name="phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              error={errors.phone}
            />
            <TextField
              label="OTP code"
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(event) => setCode(event.target.value)}
              error={errors.code}
            />
            {phoneFlow === 'signup' ? (
              <TextField
                label="Full name"
                name="fullName"
                autoComplete="name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                error={errors.fullName}
              />
            ) : null}
            <FormError message={errors.form} />
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Verifying…' : 'Verify & sign in'}
            </Button>
            <Button
              variant="ghost"
              disabled={submitting}
              onClick={() => {
                setPhoneStep('start')
                setCode('')
                setErrors({})
              }}
            >
              Use a different number
            </Button>
          </form>
        )}

        <div className="mt-6">
          <Divider label="or" />
        </div>
        <div className="mt-4">
          <SocialAuth intent="sign in" />
        </div>
        <p className="mt-8 text-center text-[16px] leading-6 text-on-surface-variant">
          New here?{' '}
          <Link
            className="font-semibold text-secondary-action hover:brightness-110"
            to="/sign-up"
          >
            Create an account
          </Link>
        </p>
      </AuthCard>
    </AuthShell>
  )
}

export function SignUpPage() {
  const {
    client,
    ready,
    signUp,
    signUpWithPhone,
    signInWithOtp,
    requestPhoneOtp,
    startPhoneAuth,
    verifyPhoneAuth,
    confirmEmail,
    resendEmailCode,
  } = useAuth()
  const navigate = useNavigate()
  const [method, setMethod] = useState<AuthMethod>('email')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [code, setCode] = useState('')
  const [phone, setPhone] = useState('')
  const [phoneCode, setPhoneCode] = useState('')
  const [phoneStep, setPhoneStep] = useState<'start' | 'verify'>('start')
  const [phoneFlow, setPhoneFlow] = useState<'login' | 'signup' | null>(null)
  const [phoneMode, setPhoneMode] = useState<'explicit' | 'auto'>('explicit')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const step: 1 | 2 = client && !client.emailVerified && client.email ? 2 : 1

  if (ready && client?.emailVerified) {
    return <Navigate to="/home" replace />
  }

  if (ready && client && !client.email && client.phoneVerified) {
    return <Navigate to="/home" replace />
  }

  async function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = signUpSchema.safeParse({
      fullName,
      email,
      password,
      confirmPassword,
    })
    if (!parsed.success) {
      setErrors(fieldErrorsFromZod(parsed.error))
      return
    }

    setErrors({})
    setSubmitting(true)
    try {
      await signUp({
        fullName: parsed.data.fullName,
        email: parsed.data.email,
        password: parsed.data.password,
      })
    } catch (error) {
      setErrors({
        form:
          error instanceof ApiError
            ? error.message
            : 'Could not create the account.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  async function onVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = emailVerifySchema.safeParse({ code })
    if (!parsed.success) {
      setErrors(fieldErrorsFromZod(parsed.error))
      return
    }

    setErrors({})
    setSubmitting(true)
    try {
      await confirmEmail(parsed.data.code)
      navigate('/home', { replace: true })
    } catch (error) {
      setErrors({
        form:
          error instanceof ApiError
            ? error.message
            : 'Could not verify email.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  async function onPhoneStart(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = phoneSchema.safeParse({ phone })
    if (!parsed.success) {
      setErrors(fieldErrorsFromZod(parsed.error))
      return
    }

    setErrors({})
    setSubmitting(true)
    try {
      if (phoneMode === 'auto') {
        const started = await startPhoneAuth(parsed.data.phone)
        setPhone(started.phone)
        setPhoneFlow(started.flow)
      } else {
        await requestPhoneOtp(parsed.data.phone, 'signup')
        setPhoneFlow('signup')
      }
      setPhoneStep('verify')
    } catch (error) {
      setErrors({
        form:
          error instanceof ApiError
            ? error.message
            : 'Could not send the signup code.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  async function onPhoneVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const needsName = phoneFlow !== 'login'

    if (needsName) {
      const parsed = phoneSignupSchema.safeParse({
        phone,
        code: phoneCode,
        fullName,
      })
      if (!parsed.success) {
        setErrors(fieldErrorsFromZod(parsed.error))
        return
      }

      setErrors({})
      setSubmitting(true)
      try {
        if (phoneMode === 'auto') {
          await verifyPhoneAuth(parsed.data)
        } else {
          await signUpWithPhone(parsed.data)
        }
        navigate('/home', { replace: true })
      } catch (error) {
        setErrors({
          form:
            error instanceof ApiError
              ? error.message
              : 'Could not complete phone sign-up.',
        })
      } finally {
        setSubmitting(false)
      }
      return
    }

    const parsed = phoneOtpSchema.safeParse({ phone, code: phoneCode })
    if (!parsed.success) {
      setErrors(fieldErrorsFromZod(parsed.error))
      return
    }

    setErrors({})
    setSubmitting(true)
    try {
      if (phoneMode === 'auto') {
        await verifyPhoneAuth(parsed.data)
      } else {
        await signInWithOtp(parsed.data.phone, parsed.data.code)
      }
      navigate('/home', { replace: true })
    } catch (error) {
      setErrors({
        form:
          error instanceof ApiError
            ? error.message
            : 'Could not complete phone sign-up.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell>
      <AuthCard
        title={
          step === 2
            ? 'Verify your email'
            : method === 'phone'
              ? 'Sign up with phone'
              : 'Create your account'
        }
        subtitle={
          step === 2
            ? `Enter the 6-digit code sent to ${client?.email ?? email}.`
            : method === 'phone'
              ? 'Request an OTP, then confirm with your name to create the account.'
              : 'Register with email and password, then verify your inbox.'
        }
        progress={step === 1 ? 50 : 100}
      >
        {step === 1 ? (
          <>
            <MethodTabs method={method} onChange={setMethod} />
            {method === 'email' ? (
              <>
                <form className="flex flex-col gap-6" onSubmit={onCreate} noValidate>
                  <TextField
                    label="Full name"
                    name="fullName"
                    autoComplete="name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    error={errors.fullName}
                  />
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    error={errors.email}
                  />
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    error={errors.password}
                  />
                  <TextField
                    label="Confirm password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    error={errors.confirmPassword}
                  />
                  <FormError message={errors.form} />
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Creating account…' : 'Continue'}
                  </Button>
                </form>
                <div className="mt-6">
                  <Divider label="or" />
                </div>
                <div className="mt-4">
                  <SocialAuth intent="sign up" />
                </div>
              </>
            ) : phoneStep === 'start' ? (
              <form className="flex flex-col gap-6" onSubmit={onPhoneStart} noValidate>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={phoneMode === 'explicit' ? 'secondary' : 'ghost'}
                    className="h-10"
                    onClick={() => setPhoneMode('explicit')}
                  >
                    Signup OTP
                  </Button>
                  <Button
                    type="button"
                    variant={phoneMode === 'auto' ? 'secondary' : 'ghost'}
                    className="h-10"
                    onClick={() => setPhoneMode('auto')}
                  >
                    Auto detect
                  </Button>
                </div>
                <TextField
                  label="Phone number"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+201012345678"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  error={errors.phone}
                />
                <FormError message={errors.form} />
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Sending code…' : 'Send code'}
                </Button>
              </form>
            ) : (
              <form className="flex flex-col gap-6" onSubmit={onPhoneVerify} noValidate>
                <TextField
                  label="Phone number"
                  name="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  error={errors.phone}
                />
                <TextField
                  label="OTP code"
                  name="code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={phoneCode}
                  onChange={(event) => setPhoneCode(event.target.value)}
                  error={errors.code}
                />
                {phoneFlow !== 'login' ? (
                  <TextField
                    label="Full name"
                    name="fullName"
                    autoComplete="name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    error={errors.fullName}
                  />
                ) : null}
                <FormError message={errors.form} />
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Creating account…' : 'Create account'}
                </Button>
                <Button
                  variant="ghost"
                  disabled={submitting}
                  onClick={() => {
                    setPhoneStep('start')
                    setPhoneCode('')
                    setErrors({})
                  }}
                >
                  Use a different number
                </Button>
              </form>
            )}
            <p className="mt-8 text-center text-[16px] leading-6 text-on-surface-variant">
              Already have an account?{' '}
              <Link
                className="font-semibold text-secondary-action hover:brightness-110"
                to="/sign-in"
              >
                Sign in
              </Link>
            </p>
          </>
        ) : (
          <form className="flex flex-col gap-6" onSubmit={onVerify} noValidate>
            <TextField
              label="Verification code"
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(event) => setCode(event.target.value)}
              error={errors.code}
            />
            <FormError message={errors.form} />
            {status ? (
              <p className="text-[14px] leading-5 text-on-surface-variant">{status}</p>
            ) : null}
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Verifying…' : 'Verify email'}
            </Button>
            <Button
              variant="ghost"
              disabled={submitting}
              onClick={async () => {
                try {
                  await resendEmailCode()
                  setStatus('A new code was requested.')
                } catch (error) {
                  setErrors({
                    form:
                      error instanceof ApiError
                        ? error.message
                        : 'Could not resend the code.',
                  })
                }
              }}
            >
              Resend code
            </Button>
            <Button variant="secondary" onClick={() => navigate('/home')}>
              Skip for now
            </Button>
          </form>
        )}
      </AuthCard>
    </AuthShell>
  )
}
