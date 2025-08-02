import { useState } from 'react'
import Modal from './modal/Modal'
import Button from './button/Button'
import ContactForm from './forms/ContactForm'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [contactOpen, setContactOpen] = useState(false)

  const handleOpenModal = (title) => {
    setModalTitle(title)
    setModalOpen(true)
  }

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
            onClick={() => handleOpenModal('Privacy Policy')}
          >
            Privacy Policy
          </button>
          <button
            className="hover:text-gray-900 transition cursor-pointer hover:underline"
            onClick={() => handleOpenModal('Terms of Service')}
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

      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <div className="p-4 text-center">
            <h2 className="text-xl font-bold mb-2">{modalTitle}</h2>
            <p className="text-gray-600 mb-4">Coming soon...</p>
            <Button fullWidth onClick={() => setModalOpen(false)} className="mt-2">
              Close
            </Button>
          </div>
        </Modal>
      )}
      {contactOpen && (
        <Modal onClose={() => setContactOpen(false)}>
          <ContactForm onClose={() => setContactOpen(false)} />
        </Modal>
      )}
    </footer>
  )
}

export default Footer
