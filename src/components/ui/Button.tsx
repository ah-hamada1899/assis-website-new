import { Slot } from '@radix-ui/react-slot'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'secondary' | 'neutral' | 'ghost' | 'icon'

const variants: Record<Variant, string> = {
  primary:
    'bg-primary-action text-white hover:brightness-110 disabled:opacity-60',
  secondary:
    'border border-secondary-action bg-transparent text-secondary-action hover:brightness-110 disabled:opacity-60',
  neutral:
    'border border-border-soft bg-surface-lowest text-on-surface hover:border-outline-variant dark:bg-surface-low',
  ghost: 'bg-transparent text-on-surface-variant hover:text-on-surface',
  icon: 'border border-border-soft bg-surface-lowest text-on-surface hover:border-outline-variant dark:bg-surface-low',
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  asChild?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  className,
  type = 'button',
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      type={asChild ? undefined : type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg text-[14px] font-semibold leading-5 tracking-[0.01em] transition-[filter,transform,box-shadow,border-color,color] duration-150 active:scale-[0.95]',
        variant === 'icon' ? 'size-10 px-0' : 'h-12 w-full px-4',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  )
}
