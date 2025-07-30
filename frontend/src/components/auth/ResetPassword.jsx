import { useState } from 'react'
import Input from '../input/Input'
import Button from '../button/Button'
import Spinner from '../spinner/spinner'
import { validate } from '../../utils/formValidation'

function ResetPassword({ email, onSubmit, isLoading, error, resendCode }) {
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [formErrors, setFormErrors] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()

    const values = {
      code: { value: code, required: true },
      newPassword: { value: newPassword, required: true },
    }

    const errors = validate(values)
    setFormErrors(errors)

    if (Object.keys(errors).length > 0) return

    onSubmit({ email, code, newPassword })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 text-center">Enter Reset Code</h2>
      <p className="text-sm text-gray-500 text-center">
        We sent a 6-digit code to <strong>{email}</strong>. Enter it along with your new password.
      </p>

      <Input
        type="text"
        placeholder="Reset code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        error={formErrors.code?.message}
      />

      <Input
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        error={formErrors.newPassword?.message}
      />

      <p className="text-xs text-gray-500 mt-[-8px]">
        Must be at least 6 characters and include a letter and a number
      </p>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <button
        type="button"
        onClick={resendCode}
        className="text-sm text-blue-600 hover:underline mt-2 cursor-pointer"
      >
        {isLoading ? <Spinner size={3} message="" /> : 'Resend Code'}
      </button>
      <Button type="submit" fullWidth disabled={isLoading}>
        {isLoading ? <Spinner size={3} message="" /> : 'Reset Password'}
      </Button>
    </form>
  )
}

export default ResetPassword
