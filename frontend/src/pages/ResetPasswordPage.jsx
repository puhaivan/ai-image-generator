import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

import ResetPasswordContent from '../components/auth/ResetPasswordContent'

function ResetPasswordPage() {
  const {
    unverifiedEmail,
    handleResetPassword,
    isResettingPassword,
    resetError,
    handleResendResetCode,
  } = useAuth()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (!unverifiedEmail) return <Navigate to="/auth/forgot-password" />

  return (
    <div className="mt-24 flex items-center justify-center px-4 bg-gradient-to-tr bg-gray-100 min-h-[500px]">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <ResetPasswordContent
          email={unverifiedEmail}
          onSubmit={handleResetPassword}
          isLoading={isResettingPassword}
          error={resetError}
          resendCode={handleResendResetCode}
        />
      </div>
    </div>
  )
}

export default ResetPasswordPage
