import * as Tooltip from '@radix-ui/react-tooltip'
import type { ReactNode } from 'react'

export function TooltipProvider({ children }: { children: ReactNode }) {
  return (
    <Tooltip.Provider delayDuration={200} skipDelayDuration={100}>
      {children}
    </Tooltip.Provider>
  )
}

export function Hint({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          sideOffset={6}
          className="rounded-sm bg-inverse-surface px-2 py-1 text-[12px] font-medium leading-4 text-inverse-on-surface shadow-lift"
        >
          {label}
          <Tooltip.Arrow className="fill-inverse-surface" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}
