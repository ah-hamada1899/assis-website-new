import * as SeparatorPrimitive from '@radix-ui/react-separator'
import { cn } from '../../lib/cn'

export function Separator({
  className,
  decorative = true,
}: {
  className?: string
  decorative?: boolean
}) {
  return (
    <SeparatorPrimitive.Root
      decorative={decorative}
      className={cn('h-px w-full bg-border-soft', className)}
    />
  )
}

export function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <Separator className="flex-1" />
      <span className="text-[12px] font-medium uppercase tracking-[0.08em] text-outline">
        {label}
      </span>
      <Separator className="flex-1" />
    </div>
  )
}
