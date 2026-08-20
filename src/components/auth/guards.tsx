import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import type { ReactNode } from 'react'

export function RequireAuth({ children }: { children: ReactNode }) {
  const { client, ready } = useAuth()
  const location = useLocation()

  if (!ready) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background text-on-surface-variant">
        Restoring session…
      </div>
    )
  }

  if (!client) {
    return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />
  }

  return children
}

export function GuestOnly({ children }: { children: ReactNode }) {
  const { client, ready } = useAuth()

  if (!ready) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background text-on-surface-variant">
        Restoring session…
      </div>
    )
  }

  if (client) {
    return <Navigate to="/home" replace />
  }

  return children
}
