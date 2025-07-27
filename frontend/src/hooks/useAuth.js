import { useEffect, useState } from 'react'
import { API_BASE_URL } from '../utils/constants'
import { validate } from '../utils/formValidation'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [authType, setAuthType] = useState('register')
  const [authOpen, setAuthOpen] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [selectedCountryCode, setSelectedCountryCode] = useState('+1')

  const [formValues, setFormValues] = useState({
    email: { value: '', required: true },
    phoneNumber: { value: '', required: true },
    password: { value: '', required: true },
    firstName: { value: '', required: true },
    lastName: { value: '', required: true },
  })

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
          credentials: 'include',
        })
        if (!res.ok) throw new Error('Not authenticated')
        const data = await res.json()
        setUser(data) // This now includes Google user info
      } catch (err) {
        setUser(null)
        console.log(err)
      }
    }

    checkAuth()
  }, [])

  const handleAuthSubmit = async (e) => {
    e.preventDefault()

    const fieldsToValidate = authType === 'login' ? ['email', 'password'] : Object.keys(formValues)

    const filteredValues = Object.fromEntries(
      Object.entries(formValues).filter(([key]) => fieldsToValidate.includes(key))
    )

    const errors = validate(filteredValues)

    setFormErrors(errors)
    if (Object.keys(errors).length > 0) return

    const payload = Object.fromEntries(
      Object.entries(formValues).map(([key, obj]) => {
        if (key === 'phoneNumber') {
          return [key, selectedCountryCode + obj.value]
        }
        return [key, obj.value]
      })
    )

    try {
      const endpoint = authType === 'login' ? 'login' : 'register'
      const res = await fetch(`${API_BASE_URL}/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      })

      const data = await res.json()

      if (!res.ok) {
        setFormErrors((prev) => ({
          ...prev,
          general: data.error || 'Something went wrong',
        }))
        return
      }

      alert(`${authType === 'login' ? 'Login' : 'Registration'} successful!`)

      const meRes = await fetch(`${API_BASE_URL}/api/auth/me`, {
        credentials: 'include',
      })
      if (meRes.ok) {
        const userData = await meRes.json()
        setUser(userData)
      }

      setAuthOpen(false)
      resetForm()
    } catch (err) {
      console.error('Login failed:', err)
      setFormErrors((prev) => ({
        ...prev,
        general: 'Something went wrong. Please try again.',
      }))
    }
  }

  const resetForm = () => {
    setFormValues({
      email: { value: '', required: true },
      phoneNumber: { value: '', required: true },
      password: { value: '', required: true },
      firstName: { value: '', required: true },
      lastName: { value: '', required: true },
    })
    setFormErrors({})
  }

  const handleLogout = async () => {
    const isGoogle = user?.method === 'google'

    const endpoint = isGoogle ? '/auth/logout' : '/api/auth/logout'

    await fetch(`${API_BASE_URL}${endpoint}`, {
      method: isGoogle ? 'GET' : 'POST',
      credentials: 'include',
    })

    setUser(null)
    setAuthType('login')
  }

  return {
    user,
    setUser,
    authType,
    setAuthType,
    authOpen,
    setAuthOpen,
    formValues,
    setFormValues,
    formErrors,
    setFormErrors,
    selectedCountryCode,
    setSelectedCountryCode,
    handleAuthSubmit,
    handleLogout,
  }
}
