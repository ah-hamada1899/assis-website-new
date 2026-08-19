import { Link } from 'react-router-dom'
import { AppHeader } from '../components/AppHeader'
import { Button } from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'

export function HomePage() {
  const { client, ready } = useAuth()

  return (
    <div className="min-h-svh bg-background">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-6 pb-16 md:px-16">
        <section className="rounded-lg border border-border-soft bg-surface-lowest p-8 shadow-lift md:p-12 dark:bg-[#1e1e1e]">
          <p className="text-[14px] font-semibold tracking-[0.01em] text-primary">
            Assis client portal
          </p>
          <h1 className="mt-3 max-w-2xl text-[32px] font-bold leading-10 tracking-[-0.01em] text-on-surface md:text-[48px] md:leading-[56px] md:tracking-[-0.02em]">
            Growth, clarity, and a calm path into your account.
          </h1>
          <p className="mt-4 max-w-xl text-[18px] leading-7 text-on-surface-variant">
            Sign in or create an account against the staging Client Auth APIs.
            Sessions use the access token plus refresh cookie/token returned by
            the backend.
          </p>
          {!ready || client ? null : (
            <div className="mt-8 flex max-w-sm gap-3">
              <Button asChild className="flex-1">
                <Link to="/sign-up">Create an account</Link>
              </Button>
              <Button variant="secondary" asChild className="flex-1">
                <Link to="/sign-in">Sign in</Link>
              </Button>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
