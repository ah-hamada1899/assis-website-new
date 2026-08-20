import { Navigate, Route, Routes } from 'react-router-dom'
import { GuestOnly, RequireAuth } from './components/auth/guards'
import { OauthReturnHandler } from './components/auth/OauthReturnHandler'
import { AccountPage } from './pages/AccountPage'
import { AppHomePage } from './pages/AppHomePage'
import { SignInPage, SignUpPage } from './pages/AuthPages'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { HomePage } from './pages/HomePage'

export default function App() {
  return (
    <>
      <OauthReturnHandler />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/sign-in"
          element={
            <GuestOnly>
              <SignInPage />
            </GuestOnly>
          }
        />
        <Route path="/login" element={<Navigate to="/sign-in" replace />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route
          path="/forgot-password"
          element={
            <GuestOnly>
              <ForgotPasswordPage />
            </GuestOnly>
          }
        />
        <Route path="/auth/callback" element={<Navigate to="/home" replace />} />
        <Route
          path="/home"
          element={
            <RequireAuth>
              <AppHomePage />
            </RequireAuth>
          }
        />
        <Route
          path="/account"
          element={
            <RequireAuth>
              <AccountPage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
