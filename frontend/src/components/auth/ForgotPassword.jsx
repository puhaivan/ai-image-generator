import { useState } from 'react'
import Input from '../input/Input'
import Button from '../button/Button'
import Spinner from '../spinner/spinner'
import { validate } from '../../utils/formValidation'

function ForgotPassword({ onSubmit, isLoading, error, onBackToLogin }) {
  const [email, setEmail] = useState('')
  const [formErrors, setFormErrors] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()

    const values = {
      email: { value: email, required: true },
    }

    const errors = validate(values)
    setFormErrors(errors)

    if (Object.keys(errors).length > 0) return

    onSubmit(email)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 text-center">Reset Your Password</h2>
      <p className="text-sm text-gray-500 text-center">
        Enter your email and we’ll send you a reset code.
      </p>

      <Input
        type="text"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={formErrors.email?.message}
      />

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <Button type="submit" fullWidth disabled={isLoading}>
        {isLoading ? <Spinner size={3} message="" /> : 'Send Reset Code'}
      </Button>

      <button
        type="button"
        onClick={onBackToLogin}
        className="text-sm text-blue-600 underline block mx-auto"
      >
        Back to Login
      </button>
    </form>
  )
}

export default ForgotPassword
