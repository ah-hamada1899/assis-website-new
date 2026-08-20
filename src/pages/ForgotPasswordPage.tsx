import { type FormEvent, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AuthCard, AuthShell } from '../components/auth/AuthCard'
import { Button } from '../components/ui/Button'
import { TextField } from '../components/ui/TextField'
import { useAuth } from '../context/AuthContext'
import {
  emailVerifySchema,
  fieldErrorsFromZod,
  phoneSchema,
  resetConfirmSchema,
  resetEmailSchema,
} from '../lib/auth-schemas'
import { cn } from '../lib/cn'
import { ApiError } from '../lib/types'

type Channel = 'email' | 'phone'
type Step = 'request' | 'verify' | 'confirm'

export function ForgotPasswordPage() {
  const {
    client,
    ready,
    requestPasswordResetByEmail,
    requestPasswordResetByPhone,
    verifyPasswordReset,
    confirmPasswordReset,
  } = useAuth()
  const navigate = useNavigate()

  const [channel, setChannel] = useState<Channel>('email')
  const [step, setStep] = useState<Step>('request')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  if (ready && client) {
    return <Navigate to="/home" replace />
  }

  async function onRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed =
      channel === 'email'
        ? resetEmailSchema.safeParse({ email })
        : phoneSchema.safeParse({ phone })
    if (!parsed.success) {
      setErrors(fieldErrorsFromZod(parsed.error))
      return
    }

    setErrors({})
    setSubmitting(true)
    try {
      if (channel === 'email') {
        await requestPasswordResetByEmail(
          (parsed.data as { email: string }).email,
        )
      } else {
        await requestPasswordResetByPhone(
          (parsed.data as { phone: string }).phone,
        )
      }
      setStep('verify')
    } catch (error) {
      setErrors({
        form:
          error instanceof ApiError
            ? error.message
            : 'Could not start password reset.',
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
      const result = await verifyPasswordReset({
        channel,
        code: parsed.data.code,
        email: channel === 'email' ? email : undefined,
        phone: channel === 'phone' ? phone : undefined,
      })
      setResetToken(result.resetToken)
      setStep('confirm')
    } catch (error) {
      setErrors({
        form:
          error instanceof ApiError
            ? error.message
            : 'Could not verify the reset code.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  async function onConfirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = resetConfirmSchema.safeParse({
      newPassword,
      confirmPassword,
    })
    if (!parsed.success) {
      setErrors(fieldErrorsFromZod(parsed.error))
      return
    }

    setErrors({})
    setSubmitting(true)
    try {
      await confirmPasswordReset(resetToken, parsed.data.newPassword)
      setDone(true)
    } catch (error) {
      setErrors({
        form:
          error instanceof ApiError
            ? error.message
            : 'Could not set the new password.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const titles: Record<Step, string> = {
    request: 'Reset your password',
    verify: 'Enter reset code',
    confirm: 'Choose a new password',
  }

  const subtitles: Record<Step, string> = {
    request:
      'Use a verified email or phone to receive a reset code.',
    verify: `Enter the 6-digit code sent to your ${channel}.`,
    confirm: 'Set a new password with the reset token from the previous step.',
  }

  return (
    <AuthShell>
      <AuthCard title={titles[step]} subtitle={subtitles[step]} progress={done ? 100 : step === 'request' ? 33 : step === 'verify' ? 66 : 100}>
        {done ? (
          <div className="flex flex-col gap-6">
            <p className="text-[16px] leading-6 text-on-surface-variant">
              Password updated. You can sign in with the new password now.
            </p>
            <Button onClick={() => navigate('/sign-in')}>Go to sign in</Button>
          </div>
        ) : step === 'request' ? (
          <form className="flex flex-col gap-6" onSubmit={onRequest} noValidate>
            <div className="grid grid-cols-2 gap-2 rounded-lg bg-surface-low p-1">
              {([
                ['email', 'Email'],
                ['phone', 'Phone'],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={cn(
                    'h-10 rounded-md text-[14px] font-semibold tracking-[0.01em] transition-colors',
                    channel === value
                      ? 'bg-surface-lowest text-on-surface shadow-lift dark:bg-[#2a2a2a]'
                      : 'text-on-surface-variant hover:text-on-surface',
                  )}
                  onClick={() => setChannel(value)}
                >
                  {label}
                </button>
              ))}
            </div>
            {channel === 'email' ? (
              <TextField
                label="Verified email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                error={errors.email}
              />
            ) : (
              <TextField
                label="Verified phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+201012345678"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                error={errors.phone}
              />
            )}
            {errors.form ? (
              <p className="text-[14px] font-medium leading-5 text-error">
                {errors.form}
              </p>
            ) : null}
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Sending…' : 'Send reset code'}
            </Button>
          </form>
        ) : step === 'verify' ? (
          <form className="flex flex-col gap-6" onSubmit={onVerify} noValidate>
            <TextField
              label="Reset code"
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(event) => setCode(event.target.value)}
              error={errors.code}
            />
            {errors.form ? (
              <p className="text-[14px] font-medium leading-5 text-error">
                {errors.form}
              </p>
            ) : null}
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Verifying…' : 'Verify code'}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setStep('request')
                setCode('')
                setErrors({})
              }}
            >
              Back
            </Button>
          </form>
        ) : (
          <form className="flex flex-col gap-6" onSubmit={onConfirm} noValidate>
            <TextField
              label="New password"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              error={errors.newPassword}
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
              {submitting ? 'Saving…' : 'Update password'}
            </Button>
          </form>
        )}

        <p className="mt-8 text-center text-[16px] leading-6 text-on-surface-variant">
          Remembered it?{' '}
          <Link
            className="font-semibold text-secondary-action hover:brightness-110"
            to="/sign-in"
          >
            Sign in
          </Link>
        </p>
      </AuthCard>
    </AuthShell>
  )
}
