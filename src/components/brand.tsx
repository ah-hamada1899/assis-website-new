import logo from '../assets/logo.png'

export function BrandMark({
  compact = false,
  showWordmark = true,
}: {
  compact?: boolean
  showWordmark?: boolean
}) {
  const size = compact ? 40 : 48
  return (
    <div className="flex items-center gap-3">
      <img
        src={logo}
        alt="Assis"
        width={size}
        height={size}
        className="rounded-lg"
      />
      {showWordmark ? (
        <div className={compact ? 'hidden sm:block' : undefined}>
          <p className="font-sans text-[18px] font-bold leading-6 tracking-[-0.02em] text-on-surface">
            Assis
          </p>
          <p className="text-[12px] font-medium leading-4 text-on-surface-variant">
            Verdant Horizon
          </p>
        </div>
      ) : null}
    </div>
  )
}

export function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.83.86-3.04.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33A8.99 8.99 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.71A5.41 5.41 0 0 1 3.69 9c0-.59.1-1.17.26-1.71V4.96H.96A8.99 8.99 0 0 0 0 9c0 1.45.35 2.82.96 4.04l3.01-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A8.99 8.99 0 0 0 .96 4.96l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  )
}

export function MicrosoftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#F25022" d="M0 0h8.6v8.6H0z" />
      <path fill="#7FBA00" d="M9.4 0H18v8.6H9.4z" />
      <path fill="#00A4EF" d="M0 9.4h8.6V18H0z" />
      <path fill="#FFB900" d="M9.4 9.4H18V18H9.4z" />
    </svg>
  )
}
