import Registration from '../components/auth/Registration'
import { useAuth } from '../context/AuthContext'
import CloseButton from '../components/button/closeButton'
import { useNavigate } from 'react-router-dom'

function RegisterPage() {
  const navigate = useNavigate()
  const {
    formValues,
    setFormValues,
    formErrors,
    selectedCountryCode,
    setSelectedCountryCode,
    handleAuthSubmit,
    registering,
  } = useAuth()

  return (
    <div className="flex justify-center items-center bg-gray-100 p-6 min-h-[calc(100vh-96px)]">
      <div className="relative w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <CloseButton onClick={() => navigate('/')} />
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        <Registration
          formValues={formValues}
          setFormValues={setFormValues}
          formErrors={formErrors}
          selectedCountryCode={selectedCountryCode}
          setSelectedCountryCode={setSelectedCountryCode}
          onSubmit={handleAuthSubmit}
          loading={registering}
        />
      </div>
    </div>
  )
}

export default RegisterPage
