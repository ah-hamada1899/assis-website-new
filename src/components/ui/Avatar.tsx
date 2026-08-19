import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cn } from '../../lib/cn'

export function Avatar({
  src,
  alt,
  fallback,
  className,
}: {
  src?: string | null
  alt: string
  fallback: string
  className?: string
}) {
  return (
    <AvatarPrimitive.Root
      className={cn(
        'inline-flex size-10 shrink-0 overflow-hidden rounded-lg bg-surface-low',
        className,
      )}
    >
      {src ? <AvatarPrimitive.Image src={src} alt={alt} className="size-full object-cover" /> : null}
      <AvatarPrimitive.Fallback
        delayMs={src ? 400 : 0}
        className="flex size-full items-center justify-center text-[12px] font-semibold text-on-surface"
      >
        {fallback}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  )
}
