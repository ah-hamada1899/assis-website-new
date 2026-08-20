import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * After AuthProvider consumes ?accessToken= / ?error= from the API 302,
 * replace the React Router location so the JWT is not left in the address bar.
 */
export function OauthReturnHandler() {
  const { ready, client, oauthError } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!ready) return

    const params = new URLSearchParams(location.search)
    const hasToken = params.has('accessToken')
    const hasError = params.has('error')
    if (!hasToken && !hasError) return

    if (hasError || oauthError) {
      navigate('/sign-in', { replace: true })
      return
    }

    if (client) {
      navigate('/home', { replace: true })
      return
    }

    navigate('/sign-in', { replace: true })
  }, [ready, client, oauthError, location.search, navigate])

  return null
}
