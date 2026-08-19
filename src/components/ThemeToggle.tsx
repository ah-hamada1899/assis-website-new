import { useTheme, type ThemePreference } from '../context/ThemeContext'
import { Button } from './ui/Button'
import { Hint } from './ui/Hint'
import { Menu, MenuContent, MenuRadioGroup, MenuRadioItem, MenuTrigger } from './ui/Menu'

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

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()

  return (
    <Menu>
      <Hint label="Theme">
        <MenuTrigger asChild>
          <Button variant="icon" aria-label="Choose theme" className="w-10">
            {resolvedTheme === 'dark' ? <MoonIcon /> : <SunIcon />}
          </Button>
        </MenuTrigger>
      </Hint>
      <MenuContent>
        <MenuRadioGroup
          value={theme}
          onValueChange={(value) => setTheme(value as ThemePreference)}
        >
          <MenuRadioItem value="light">
            <span className="flex items-center gap-2">
              <SunIcon /> Light
            </span>
          </MenuRadioItem>
          <MenuRadioItem value="dark">
            <span className="flex items-center gap-2">
              <MoonIcon /> Dark
            </span>
          </MenuRadioItem>
          <MenuRadioItem value="system">
            <span className="flex items-center gap-2">
              <SystemIcon /> System
            </span>
          </MenuRadioItem>
        </MenuRadioGroup>
      </MenuContent>
    </Menu>
  )
}
