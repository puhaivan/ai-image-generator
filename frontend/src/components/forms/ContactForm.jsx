import { useState } from 'react'
import Button from '../button/Button'
import Input from '../input/Input'
import { toast } from 'react-toastify'
import { API_BASE_URL } from '../../utils/constants'
import { FORM_FIELDS, validate } from '../../utils/formValidation'

function ContactForm({ onClose }) {
  const [values, setValues] = useState({
    [FORM_FIELDS.NAME]: { value: '', required: true },
    [FORM_FIELDS.EMAIL]: { value: '', required: true },
    [FORM_FIELDS.MESSAGE]: { value: '', required: true },
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (field, val) => {
    setValues((prev) => ({
      ...prev,
      [field]: { ...prev[field], value: val },
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = validate(values, { ...errors })
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values[FORM_FIELDS.NAME].value,
          email: values[FORM_FIELDS.EMAIL].value,
          message: values[FORM_FIELDS.MESSAGE].value,
        }),
      })

      if (!res.ok) throw new Error('Failed to send message')

      toast.success('Your message has been sent!')
      onClose()
      setValues({
        [FORM_FIELDS.NAME]: { value: '', required: true },
        [FORM_FIELDS.EMAIL]: { value: '', required: true },
        [FORM_FIELDS.MESSAGE]: { value: '', required: true },
      })
    } catch (err) {
      console.error('❌ Contact form error:', err)
      toast.error('Failed to send message. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center">
      <div className="p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-center">Contact Us</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Your Name"
            value={values[FORM_FIELDS.NAME].value}
            onChange={(e) => handleChange(FORM_FIELDS.NAME, e.target.value)}
            placeholder="John Doe"
            error={errors[FORM_FIELDS.NAME]?.message}
          />
          <Input
            type="email"
            label="Your Email"
            value={values[FORM_FIELDS.EMAIL].value}
            onChange={(e) => handleChange(FORM_FIELDS.EMAIL, e.target.value)}
            placeholder="john@example.com"
            error={errors[FORM_FIELDS.EMAIL]?.message}
          />
          <Input
            as="textarea"
            label="Your Message"
            value={values[FORM_FIELDS.MESSAGE].value}
            onChange={(e) => handleChange(FORM_FIELDS.MESSAGE, e.target.value)}
            placeholder="Type your message here..."
            error={errors[FORM_FIELDS.MESSAGE]?.message}
            rows="4"
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
