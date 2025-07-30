import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

import ForgotPasswordContent from '../components/auth/ForgotPasswordContent'

function ForgotPasswordPage() {
  const { handleForgotPassword, isRequestingResetCode, resetRequestError, setResetStep } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow-md rounded-lg">
      <ForgotPasswordContent
        onSubmit={(email) => {
          setResetStep('verify')
          handleForgotPassword(email)
        }}
        isLoading={isRequestingResetCode}
        error={resetRequestError}
        onBackToLogin={() => navigate('/auth/login')}
      />
    </div>
  )
}

export default ForgotPasswordPage
