import ForgotPassword from '../components/auth/ForgotPassword'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function ForgotPasswordPage() {
  const { handleForgotPassword, forgotLoading, forgotError, setResetStep } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow-md rounded-lg">
      <ForgotPassword
        onSubmit={(email) => {
          setResetStep('verify')
          handleForgotPassword(email)
        }}
        isLoading={forgotLoading}
        error={forgotError}
        onBackToLogin={() => navigate('/auth/login')}
      />
    </div>
  )
}

export default ForgotPasswordPage
