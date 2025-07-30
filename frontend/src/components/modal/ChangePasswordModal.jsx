import { useState } from 'react'
import Input from '../input/Input'
import Button from '../button/Button'
import { toast } from 'react-toastify'
import { API_BASE_URL } from '../../utils/constants'
import { validate } from '../../utils/formValidation'

function ChangePassword({ onClose }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [formErrors, setFormErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const fields = {
      currentPassword: { value: currentPassword, required: true },
      newPassword: { value: newPassword, required: true },
    }

    const errors = validate(fields)

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      setLoading(false)
      return
    }

    if (currentPassword === newPassword) {
      setFormErrors({
        ...errors,
        newPassword: {
          message: 'New password must be different from the current password',
        },
      })
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
        credentials: 'include',
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Something went wrong')

      toast.success('🔐 Password changed successfully')
      onClose?.()
    } catch (err) {
      toast.error(`❌ ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 p-4">
      <h2 className="text-lg font-bold">Change Password</h2>

      <Input
        type="password"
        placeholder="Current Password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        error={formErrors.currentPassword?.message}
      />

      <Input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        error={formErrors.newPassword?.message}
      />

      <p className="text-xs text-gray-500 mt-[-12px]">
        Must be at least 6 characters and include a letter and a number
      </p>

      <Button type="submit" fullWidth disabled={loading}>
        {loading ? 'Changing...' : 'Change Password'}
      </Button>
    </form>
  )
}

export default ChangePassword
