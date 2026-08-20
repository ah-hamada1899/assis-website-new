import { Link } from 'react-router-dom'
import { AppHeader } from '../components/AppHeader'
import { Button } from '../components/ui/Button'
import { Separator } from '../components/ui/Separator'
import { useAuth } from '../context/AuthContext'

export function AppHomePage() {
  const { client } = useAuth()

  if (!client) return null

  return (
    <div className="min-h-svh bg-background">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-6 pb-16 md:px-16">
        <section className="rounded-lg border border-border-soft bg-surface-lowest p-8 shadow-lift md:p-12 dark:bg-[#1e1e1e]">
          <p className="text-[14px] font-semibold tracking-[0.01em] text-primary">
            Home
          </p>
          <h1 className="mt-3 text-[32px] font-bold leading-10 tracking-[-0.01em] text-on-surface md:text-[48px] md:leading-[56px] md:tracking-[-0.02em]">
            Welcome back, {client.fullName.split(' ')[0]}
          </h1>
          <p className="mt-4 max-w-xl text-[18px] leading-7 text-on-surface-variant">
            You are signed in to Assis. Continue to your profile or start a new
            request when you are ready.
          </p>
        </section>
        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-lg border border-border-soft bg-surface-lowest p-8 shadow-lift dark:bg-[#1e1e1e]">
            <h2 className="text-[24px] font-semibold leading-8 text-on-surface">
              Profile
            </h2>
            <p className="mt-2 text-[16px] leading-6 text-on-surface-variant">
              {client.email ?? 'No email on file'}
            </p>
            <Separator className="my-6" />
            <Button asChild variant="secondary" className="w-auto px-5">
              <Link to="/account">View account</Link>
            </Button>
          </article>
          <article className="rounded-lg border border-border-soft bg-surface-lowest p-8 shadow-lift dark:bg-[#1e1e1e]">
            <h2 className="text-[24px] font-semibold leading-8 text-on-surface">
              Next step
            </h2>
            <p className="mt-2 text-[16px] leading-6 text-on-surface-variant">
              {client.emailVerified
                ? 'Your email is verified. You can pick up company requests from here.'
                : 'Verify your email to finish setting up this account.'}
            </p>
            <Separator className="my-6" />
            {client.emailVerified ? (
              <p className="text-[14px] font-medium text-on-surface-variant">
                Requests will appear here.
              </p>
            ) : (
              <Button asChild className="w-auto px-5">
                <Link to="/sign-up">Verify email</Link>
              </Button>
            )}
          </article>
        </section>
      </main>
    </div>
  )
}
