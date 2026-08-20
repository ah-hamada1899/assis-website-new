import { z } from 'zod'

export const signInSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, 'Enter your email or username'),
  password: z.string().min(1, 'Enter your password'),
})

export type SignInValues = z.infer<typeof signInSchema>

export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, 'Enter your full name')
      .max(255, 'Name is too long'),
    email: z
      .string()
      .trim()
      .min(1, 'Enter your email')
      .email('Enter a valid email')
      .max(255, 'Email is too long'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password is too long'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type SignUpValues = z.infer<typeof signUpSchema>

export const emailVerifySchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Enter the 6-digit code'),
})

export type EmailVerifyValues = z.infer<typeof emailVerifySchema>

export const phoneSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(8, 'Enter a valid phone number')
    .max(30, 'Phone number is too long'),
})

export const phoneOtpSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(8, 'Enter a valid phone number')
    .max(30, 'Phone number is too long'),
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Enter the 6-digit code'),
})

export const phoneSignupSchema = phoneOtpSchema.extend({
  fullName: z
    .string()
    .trim()
    .min(1, 'Enter your full name')
    .max(255, 'Name is too long'),
})

export const resetEmailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Enter your email')
    .email('Enter a valid email')
    .max(255, 'Email is too long'),
})

export const resetConfirmSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password is too long'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export function fieldErrorsFromZod(
  error: z.ZodError,
): Record<string, string> {
  const next: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form')
    if (!next[key]) next[key] = issue.message
  }
  return next
}
