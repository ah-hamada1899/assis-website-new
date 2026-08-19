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
  signInSchema,
  signUpSchema,
} from '../lib/auth-schemas'
import { ApiError } from '../lib/types'

export function SignInPage() {
  const { client, ready, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    (location.state as { from?: string } | null)?.from ?? '/account'

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  if (ready && client) {
    return <Navigate to={from} replace />
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
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
      const message =
        error instanceof ApiError
          ? error.message
          : 'Could not sign in. Check the staging API and try again.'
      setErrors({ form: message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell>
      <AuthCard
        title="Welcome back"
        subtitle="Sign in with your email or username to continue."
      >
        <form className="flex flex-col gap-6" onSubmit={onSubmit} noValidate>
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
          {errors.form ? (
            <p className="text-[14px] font-medium leading-5 text-error">
              {errors.form}
            </p>
          ) : null}
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
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
  const { client, ready, signUp, confirmEmail, resendEmailCode, emailHint } =
    useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [code, setCode] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const step: 1 | 2 = client && !client.emailVerified ? 2 : 1

  if (ready && client?.emailVerified) {
    return <Navigate to="/account" replace />
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
      const message =
        error instanceof ApiError
          ? error.message
          : 'Could not create the account.'
      setErrors({ form: message })
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
      navigate('/account', { replace: true })
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'Could not verify email.'
      setErrors({ form: message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell>
      <AuthCard
        title={step === 1 ? 'Create your account' : 'Verify your email'}
        subtitle={
          step === 1
            ? 'Sign up with email and password. You can bind a phone later from your profile.'
            : `Enter the 6-digit code sent to ${client?.email ?? email}.`
        }
        progress={step === 1 ? 50 : 100}
      >
        {step === 1 ? (
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
              {errors.form ? (
                <p className="text-[14px] font-medium leading-5 text-error">
                  {errors.form}
                </p>
              ) : null}
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
            {emailHint?.code ? (
              <p className="rounded-lg bg-surface-low px-4 py-3 text-[14px] leading-5 text-on-surface-variant">
                Staging returned a test code:{' '}
                <span className="font-semibold text-primary">{emailHint.code}</span>
              </p>
            ) : null}
            {errors.form ? (
              <p className="text-[14px] font-medium leading-5 text-error">
                {errors.form}
              </p>
            ) : null}
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
            <Button variant="secondary" onClick={() => navigate('/account')}>
              Skip for now
            </Button>
          </form>
        )}
      </AuthCard>
    </AuthShell>
  )
}
