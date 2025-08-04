import { useState, useEffect } from 'react'
import Modal from './Modal'
import Button from '../button/Button'

function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false)

  useEffect(() => {
    const consentGiven = localStorage.getItem('cookieConsent')
    if (!consentGiven) {
      setShowConsent(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true')
    setShowConsent(false)
  }

  return (
    <Modal isOpen={showConsent} onClose={handleAccept}>
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
