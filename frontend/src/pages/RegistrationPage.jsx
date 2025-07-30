import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

import RegistrationContent from '../components/auth/RegistrationContent'
import CloseButton from '../components/button/closeButton'

function RegisterPage() {
  const navigate = useNavigate()
  const {
    formValues,
    setFormValues,
    formErrors,
    selectedCountryCode,
    setSelectedCountryCode,
    handleAuthSubmit,
    isRegistering,
  } = useAuth()

  return (
    <div className="flex justify-center items-center bg-gray-100 p-6 min-h-[calc(100vh-96px)]">
      <div className="relative w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <CloseButton onClick={() => navigate('/')} />
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        <RegistrationContent
          formValues={formValues}
          setFormValues={setFormValues}
          formErrors={formErrors}
          selectedCountryCode={selectedCountryCode}
          setSelectedCountryCode={setSelectedCountryCode}
          onSubmit={handleAuthSubmit}
          loading={isRegistering}
        />
      </div>
    </div>
  )
}

export default RegisterPage
