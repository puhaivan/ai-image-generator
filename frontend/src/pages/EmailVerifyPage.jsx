import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

import EmailVerificationContent from '../components/auth/EmailVerificationContent'

function EmailVerifyPage() {
  const { unverifiedEmail } = useAuth()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (!unverifiedEmail) return <Navigate to="/" />

  return (
    <div className="flex items-center justify-center px-4 py-12 bg-gradient-to-tr from-blue-50 to-purple-100">
      <EmailVerificationContent email={unverifiedEmail} />
    </div>
  )
}

export default EmailVerifyPage
