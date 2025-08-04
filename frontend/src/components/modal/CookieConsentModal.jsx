import { useEffect } from 'react'
import Modal from './Modal'
import Button from '../button/Button'

function CookieConsent({ isOpen, setIsOpen }) {
  useEffect(() => {
    const consentGiven = localStorage.getItem('cookieConsent')
    if (!consentGiven) {
      setIsOpen(true)
    }
  }, [setIsOpen])

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true')
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <div className="text-center p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">We Use Cookies</h2>
        <p className="text-sm text-gray-600 mb-4">
          We use cookies to enhance your experience, store login sessions, and generate images
          securely.
        </p>
        <Button onClick={handleAccept} fullWidth>
          Accept
        </Button>
      </div>
    </Modal>
  )
}

export default CookieConsent
