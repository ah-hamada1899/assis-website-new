import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function OAuthCallbackPage() {
  const { client, ready } = useAuth()

  if (!ready) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background text-on-surface-variant">
        Completing sign-in…
      </div>
    )
  }

  return <Navigate to={client ? '/account' : '/sign-in'} replace />
}
