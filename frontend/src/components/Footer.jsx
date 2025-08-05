import { useNavigate } from 'react-router-dom'
import Modal from './modal/Modal'
import ContactForm from './forms/ContactForm'

const Footer = ({ contactOpen, setContactOpen }) => {
  const currentYear = new Date().getFullYear()

  const navigate = useNavigate()

  return (
    <footer className="bg-gradient-to-r from-blue-100 to-purple-100 mt-8 rounded-t-xl shadow-inner">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-gray-600 text-sm text-center md:text-left">
          © {currentYear} <span className="font-semibold text-gray-800">Promptify AIG</span>. All
          rights reserved.
        </div>

        <div className="flex gap-6 text-sm text-gray-600">
          <button
            className="hover:text-gray-900 transition cursor-pointer hover:underline"
            onClick={() => navigate('/privacy-policy')}
          >
            Privacy Policy
          </button>
          <button
            className="hover:text-gray-900 transition cursor-pointer hover:underline"
            onClick={() => navigate('/terms-of-service')}
          >
            Terms of Service
          </button>
          <button
            onClick={() => setContactOpen(true)}
            className="hover:text-gray-900 transition cursor-pointer hover:underline"
          >
            Contact
          </button>
        </div>

        <div className="flex items-center gap-2">
          <img src="/images/logo.png" alt="Promptify Logo" className="w-8 h-8 object-contain" />
          <span className="font-semibold text-gray-700">Promptify AIG</span>
        </div>
      </div>

      {contactOpen && (
        <Modal onClose={() => setContactOpen(false)}>
          <ContactForm onClose={() => setContactOpen(false)} />
        </Modal>
      )}
    </footer>
  )
}

export default Footer
