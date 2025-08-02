import { useState } from 'react'
import Button from '../button/Button'
import { toast } from 'react-toastify'
import { API_BASE_URL } from '../../utils/constants'

function ContactForm({ onClose }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    await fetch(`${API_BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    })

    setLoading(false)
    onClose()
    toast.success('Your message has been sent!')
  }

  return (
    <div className="flex items-center justify-center">
      <div className="p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-center">Contact Us</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <textarea
            placeholder="Your Message"
            className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="4"
            required
          />
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default ContactForm
