import Button from './button/Button'
import hamburgerMenuIcon from '/images/hamburger-menu-icon.svg'

const Header = ({
  user,
  authType,
  setAuthType,
  setAuthOpen,
  setFormValues,
  setFormErrors,
  setSelectedCountryCode,
  setMobilePanelOpen,
}) => {
  const handleLoginClick = () => {
    setAuthType(authType === 'login' ? 'login' : 'register')
    setAuthOpen(true)
    setFormValues({
      email: { value: '', required: true },
      phoneNumber: { value: '', required: true },
      password: { value: '', required: true },
      firstName: { value: '', required: true },
      lastName: { value: '', required: true },
    })
    setFormErrors({})
    setSelectedCountryCode('+1')
  }
  return (
    <header className="relative bg-gradient-to-r from-blue-100 to-purple-100 shadow-md rounded-xl px-6 py-6 mb-8 mr-4 ml-4 mt-4">
      <div className="flex items-center justify-between">
        {user && (
          <button
            onClick={() => setMobilePanelOpen(true)}
            className="lg:hidden p-2 mr-2 rounded-md text-white hover:text-blue-700 cursor-pointer transition"
          >
            <img src={hamburgerMenuIcon} alt="Hamburger Menu" className="w-6 h-6" />
          </button>
        )}

        <div className="text-center mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-800 drop-shadow-sm">
            Start creating your images
          </h1>
          <p className="text-sm font-medium text-gray-600 mt-1 tracking-wide">
            Let your thoughts take visual form — turn your ideas into stunning AI-generated art
          </p>
        </div>

        <div className="absolute hidden lg:block right-4 top-1/2 -translate-y-1/2">
          {!user && (
            <Button onClick={handleLoginClick}>
              {authType === 'login' ? 'Login' : 'Register'}
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
