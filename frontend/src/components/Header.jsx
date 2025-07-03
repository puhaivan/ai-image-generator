import Button from './button/Button'

function Header({
  user,
  authType,
  setAuthOpen,
  setFormValues,
  setFormErrors,
  setSelectedCountryCode,
  onLogout,
}) {
  const handleLoginClick = () => {
    setAuthOpen(true)
    setFormValues({
      phoneNumber: { value: '', required: true },
      password: { value: '', required: true },
      firstName: { value: '', required: true },
      lastName: { value: '', required: true },
    })
    setFormErrors({})
    setSelectedCountryCode('+1')
  }

  return (
    <header className="relative bg-gradient-to-r from-blue-100 to-purple-100 shadow-md rounded-xl px-6 py-6 mb-8">
      <div className="lg:absolute w-fit mx-auto top-6 right-6 ">
        {!user ? (
          <Button onClick={handleLoginClick}>
            {authType === 'login' ? 'Login' : 'Register'}
          </Button>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded shadow-sm">
            <div className="text-sm text-gray-800 font-medium">
                 <h3>👋 Hello,</h3><h3 className="font-semibold text-blue-700">{user.firstName} {user.lastName}</h3>
            </div>
            <div>
            <Button onClick={onLogout}>Logout</Button>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center text-center gap-2">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
          Start creating your images from your imagination
        </h2>
        <p className="text-sm text-gray-600 max-w-md">
          Let your thoughts take visual form — turn your ideas into stunning AI-generated art.
        </p>
      </div>
    </header>
  )
}

export default Header
