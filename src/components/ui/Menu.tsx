import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/cn'

export function Menu(props: ComponentProps<typeof DropdownMenu.Root>) {
  return <DropdownMenu.Root {...props} />
}

export function MenuTrigger(props: ComponentProps<typeof DropdownMenu.Trigger>) {
  return <DropdownMenu.Trigger {...props} />
}

export function MenuRadioGroup(
  props: ComponentProps<typeof DropdownMenu.RadioGroup>,
) {
  return <DropdownMenu.RadioGroup {...props} />
}

export function MenuContent({
  children,
  className,
  align = 'end',
}: {
  children: ReactNode
  className?: string
  align?: 'start' | 'center' | 'end'
}) {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        align={align}
        sideOffset={8}
        className={cn(
          'z-50 min-w-[11.5rem] rounded-lg border border-border-soft bg-surface-lowest p-1 shadow-lift outline-none dark:bg-[#1e1e1e]',
          className,
        )}
      >
        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  )
}

export function MenuRadioItem({
  value,
  children,
}: {
  value: string
  children: ReactNode
}) {
  return (
    <DropdownMenu.RadioItem
      value={value}
      className="relative flex cursor-pointer items-center rounded-sm py-2 pr-3 pl-8 text-[14px] font-semibold leading-5 text-on-surface outline-none data-[highlighted]:bg-surface-low data-[state=checked]:text-primary"
    >
      <DropdownMenu.ItemIndicator className="absolute left-2 text-primary">
        <CheckIcon />
      </DropdownMenu.ItemIndicator>
      {children}
    </DropdownMenu.RadioItem>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M3 7.2 5.6 10 11 3.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
