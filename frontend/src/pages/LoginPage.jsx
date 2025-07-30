import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

import CloseButton from '../components/button/closeButton'
import LoginContent from '../components/auth/LoginContent'

function LoginPage() {
  const navigate = useNavigate()
  const {
    formValues,
    setFormValues,
    formErrors,
    handleAuthSubmit,
    setResetStep,
    setShowResetModal,
  } = useAuth()

  return (
    <div className="flex justify-center items-center bg-gray-100 p-6 max-h-screen">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <CloseButton onClick={() => navigate('/')} />
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <LoginContent
          formValues={formValues}
          setFormValues={setFormValues}
          formErrors={formErrors}
          onSubmit={handleAuthSubmit}
          setResetStep={setResetStep}
          setShowResetModal={setShowResetModal}
        />
      </div>
    </div>
  )
}

export default LoginPage
