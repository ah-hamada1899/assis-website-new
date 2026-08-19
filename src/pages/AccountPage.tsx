import { Link } from 'react-router-dom'
import { AppHeader } from '../components/AppHeader'
import { Avatar } from '../components/ui/Avatar'
import { Button } from '../components/ui/Button'
import { Separator } from '../components/ui/Separator'
import { useAuth } from '../context/AuthContext'

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex rounded-sm px-2 py-1 text-[12px] font-medium leading-4 ${
        ok
          ? 'bg-primary-container/20 text-on-primary-container'
          : 'bg-error-container text-on-error-container'
      }`}
    >
      {label}
    </span>
  )
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function AccountPage() {
  const { client } = useAuth()

  if (!client) return null

  return (
    <div className="min-h-svh bg-background">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-[440px] flex-col px-6 pb-16 md:max-w-[1200px] md:px-16">
        <div className="w-full max-w-[440px] rounded-lg border border-border-soft bg-surface-lowest p-8 shadow-lift sm:p-12 dark:bg-[#1e1e1e]">
          <div className="flex items-center gap-4">
            <Avatar
              src={client.avatarUrl}
              alt={client.fullName}
              fallback={initials(client.fullName)}
              className="size-14 rounded-lg"
            />
            <div>
              <h1 className="text-[28px] font-bold leading-9 tracking-[-0.01em] text-on-surface md:text-[32px] md:leading-10">
                {client.fullName}
              </h1>
              <p className="mt-1 text-[16px] leading-6 text-on-surface-variant">
                Signed in via {client.provider}
              </p>
            </div>
          </div>
          <Separator className="my-8" />
          <p className="text-[16px] leading-6 text-on-surface-variant">
            Profile loaded from{' '}
            <code className="rounded-sm bg-surface-low px-1">GET /clients/me</code>.
          </p>
          <dl className="mt-8 flex flex-col gap-6 text-[16px] leading-6">
            <div>
              <dt className="text-[14px] font-semibold tracking-[0.01em] text-on-surface">
                Email
              </dt>
              <dd className="mt-2 flex flex-wrap items-center gap-2 text-on-surface-variant">
                {client.email ?? 'Not set'}
                <StatusPill
                  ok={client.emailVerified}
                  label={client.emailVerified ? 'Verified' : 'Unverified'}
                />
              </dd>
            </div>
            <div>
              <dt className="text-[14px] font-semibold tracking-[0.01em] text-on-surface">
                Username
              </dt>
              <dd className="mt-2 text-on-surface-variant">
                {client.username ?? 'Not set'}
              </dd>
            </div>
            <div>
              <dt className="text-[14px] font-semibold tracking-[0.01em] text-on-surface">
                Phone
              </dt>
              <dd className="mt-2 flex flex-wrap items-center gap-2 text-on-surface-variant">
                {client.primaryPhone ?? 'Not bound yet'}
                <StatusPill
                  ok={client.phoneVerified}
                  label={client.phoneVerified ? 'Verified' : 'Unverified'}
                />
              </dd>
            </div>
          </dl>
          {!client.emailVerified ? (
            <Button asChild variant="secondary" className="mt-8">
              <Link to="/sign-up">Verify email</Link>
            </Button>
          ) : null}
        </div>
      </main>
    </div>
  )
}
