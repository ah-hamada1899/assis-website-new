import * as ProgressPrimitive from '@radix-ui/react-progress'

export function Progress({ value }: { value: number }) {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <ProgressPrimitive.Root
      value={clamped}
      className="absolute inset-x-0 top-0 h-1 overflow-hidden bg-surface-container"
    >
      <ProgressPrimitive.Indicator
        className="h-full bg-primary-action transition-[transform] duration-300"
        style={{ transform: `translateX(-${100 - clamped}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}
