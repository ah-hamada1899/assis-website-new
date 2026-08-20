import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useTheme, type ThemePreference } from '../context/ThemeContext'

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 3v2M12 19v2M5 12H3M21 12h-2M6.2 6.2 7.6 7.6M16.4 16.4l1.4 1.4M6.2 17.8 7.6 16.4M16.4 7.6l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M17.5 14.2A7.2 7.2 0 0 1 9.8 6.5 7 7 0 1 0 17.5 14.2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SystemIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 20h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

const options: Array<{
  value: ThemePreference
  label: string
  icon: typeof SunIcon
}> = [
  { value: 'light', label: 'Light', icon: SunIcon },
  { value: 'dark', label: 'Dark', icon: MoonIcon },
  { value: 'system', label: 'System', icon: SystemIcon },
]

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="Theme"
          title="Theme"
          className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border-soft bg-surface-lowest text-on-surface outline-none hover:border-outline-variant focus-visible:border-primary-action focus-visible:shadow-[0_0_0_2px_rgb(76_175_80_/_0.2)] dark:bg-surface-low"
        >
          {resolvedTheme === 'dark' ? <MoonIcon /> : <SunIcon />}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          collisionPadding={12}
          className="z-[200] min-w-[12rem] rounded-lg border border-border-soft bg-surface-lowest p-1 shadow-lift outline-none dark:bg-[#1e1e1e]"
        >
          <DropdownMenu.Label className="px-3 py-2 text-[12px] font-medium tracking-[0.01em] text-outline">
            Appearance
          </DropdownMenu.Label>
          <DropdownMenu.RadioGroup
            value={theme}
            onValueChange={(value) => setTheme(value as ThemePreference)}
          >
            {options.map((option) => {
              const Icon = option.icon
              return (
                <DropdownMenu.RadioItem
                  key={option.value}
                  value={option.value}
                  className="relative flex cursor-pointer items-center gap-2 rounded-sm py-2 pr-3 pl-8 text-[14px] font-semibold leading-5 text-on-surface outline-none select-none data-[highlighted]:bg-surface-low data-[state=checked]:text-primary"
                >
                  <DropdownMenu.ItemIndicator className="absolute left-2 text-primary">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path
                        d="M3 7.2 5.6 10 11 3.8"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </DropdownMenu.ItemIndicator>
                  <Icon />
                  {option.label}
                </DropdownMenu.RadioItem>
              )
            })}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
