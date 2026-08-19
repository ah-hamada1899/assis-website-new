import { Link } from 'react-router-dom'
import { BrandMark } from './brand'
import { ThemeToggle } from './ThemeToggle'
import { Avatar } from './ui/Avatar'
import { Button } from './ui/Button'
import { useAuth } from '../context/AuthContext'

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function AppHeader() {
  const { client, ready, signOut } = useAuth()

  return (
    <header className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-6 py-6 md:px-16">
      <Link to="/" className="min-w-0">
        <BrandMark compact />
      </Link>
      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />
        {ready && client ? (
          <>
            <Button variant="ghost" asChild className="hidden w-auto px-2 sm:inline-flex">
              <Link to="/account" className="gap-2">
                <Avatar
                  src={client.avatarUrl}
                  alt={client.fullName}
                  fallback={initials(client.fullName)}
                  className="size-8"
                />
                <span>{client.fullName}</span>
              </Link>
            </Button>
            <Button
              variant="secondary"
              className="w-auto px-5"
              onClick={() => void signOut()}
            >
              Sign out
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" asChild className="w-auto px-4">
              <Link to="/sign-in">Sign in</Link>
            </Button>
            <Button asChild className="w-auto px-5">
              <Link to="/sign-up">Sign up</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  )
}
