import { useLocation, useNavigate } from 'react-router-dom'
import Button from './button/Button'
import hamburgerMenuIcon from '/images/hamburger-menu-icon.svg'

const Header = ({ user, setMobilePanelOpen }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLoginClick = () => {
    navigate('/auth/login')
  }

  return (
    <header className="relative bg-gradient-to-r from-blue-100 to-purple-100 shadow-md rounded-xl px-6 py-6 mb-8 mx-4 mt-4">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 lg:gap-4 lg:order-1 lg:w-48">
          {user && (
            <button
              onClick={() => setMobilePanelOpen(true)}
              className="lg:hidden p-2 rounded-md text-white hover:text-blue-700 cursor-pointer transition"
            >
              <img src={hamburgerMenuIcon} alt="Menu" className="w-6 h-6" />
            </button>
          )}

          <img
            src="/images/logo.png"
            alt="Promptify AIG Logo"
            className="w-50 h-15 rounded-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={() => navigate('/')}
          />
        </div>
        <div className="text-center lg:order-2 flex-1">
          <h1 className="text-3xl font-extrabold text-gray-800 drop-shadow-sm">
            Start creating your images
          </h1>
          <p className="text-sm font-medium text-gray-600 mt-1 tracking-wide">
            Let your thoughts take visual form — turn your ideas into stunning AI-generated art
          </p>
        </div>

        <div className="hidden lg:block lg:order-3 lg:w-48">
          {!user && location.pathname === '/' && <Button onClick={handleLoginClick}>Login</Button>}
        </div>
      </div>
    </header>
  )
}

export default Header
