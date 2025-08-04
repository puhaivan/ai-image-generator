import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { toast } from 'react-toastify'

import { API_BASE_URL } from '../utils/constants'
import { validate } from '../utils/formValidation'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  const [selectedCountryCode, setSelectedCountryCode] = useState('+1')
  const [showVerificationStep, setShowVerificationStep] = useState(false)
  const [unverifiedEmail, setUnverifiedEmail] = useState('')
  const [isVerifyingCode, setIsVerifyingCode] = useState(false)
  const [verificationError, setVerificationError] = useState(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const [isRequestingResetCode, setIsRequestingResetCode] = useState(false)
  const [isVerifyingLogin, setIsVerifyingLogin] = useState(false)
  const [resetRequestError, setResetRequestError] = useState(null)
  const [resetStep, setResetStep] = useState('request')

  const [isResettingPassword, setIsResettingPassword] = useState(false)
  const [resetError, setResetError] = useState('')

  const navigate = useNavigate()

  const [formValues, setFormValues] = useState({
    email: { value: '', required: true },
    phoneNumber: { value: '', required: true },
    password: { value: '', required: true },
    firstName: { value: '', required: true },
    lastName: { value: '', required: true },
  })

  useEffect(() => {
    const localEmail = localStorage.getItem('unverifiedEmail')
    const shouldVerify = localStorage.getItem('showVerification') === 'true'

    if (shouldVerify && localEmail) {
      setUnverifiedEmail(localEmail)
      setShowVerificationStep(true)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
        credentials: 'include',
      })

      if (res.status === 403) {
        const data = await res.json()
        if (data.requiresVerification && data.email) {
          setUnverifiedEmail(data.email)
          setShowVerificationStep(true)
        }
        setUser(null)
        return
      }
      if (res.status === 401) {
        setUser(null)
        return
      }

      if (!res.ok) {
        throw new Error(`Auth check failed: ${res.status}`)
      }

      const data = await res.json()
      setUser(data)
    } catch (err) {
      console.error('❌ Unexpected auth check error:', err.message)
      setUser(null)
      throw err
    }
  }

  const handleLogin = async (credentials) => {
    setIsVerifyingLogin(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentials),
      })

      if (res.status === 401) {
        const data = await res.json()
        setFormErrors((prev) => ({
          ...prev,
          general: data.error || 'Invalid email or password',
        }))
        return
      }

      if (!res.ok) throw new Error(`Login failed: ${res.status}`)

      const data = await res.json()

      if (data.requiresVerification) {
        setUnverifiedEmail(data.email)
        setShowVerificationStep(true)
        return
      }

      await loadUser()
      setIsVerifyingLogin(false)
      toast.success('Login successful')
      navigate('/')
    } catch (err) {
      console.error('❌ Unexpected login error:', err.message)
      setFormErrors((prev) => ({
        ...prev,
        general: 'Unexpected server error. Please try again.',
      }))
    }
  }

  const handleAuthSubmit = async (e) => {
    e.preventDefault()

    const path = window.location.pathname
    const isLogin = path.includes('/auth/login')
    const fieldsToValidate = isLogin ? ['email', 'password'] : Object.keys(formValues)

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

    if (isLogin) {
      await handleLogin(payload)
    } else {
      try {
        setIsRegistering(true)
        const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
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

        toast.success('Registration successful, please verify your email')
        setUnverifiedEmail(payload.email)
        setShowVerificationStep(true)
        localStorage.setItem('unverifiedEmail', payload.email)
        localStorage.setItem('showVerification', 'true')
        navigate('/auth/verify')
      } catch (err) {
        console.error('Registration failed:', err)
        setFormErrors((prev) => ({
          ...prev,
          general: 'Something went wrong. Please try again.',
        }))
      } finally {
        setIsRegistering(false)
      }
    }
  }

  const handleVerificationSubmit = async (code) => {
    setIsVerifyingCode(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: unverifiedEmail, code }),
      })

      const data = await res.json()

      if (res.ok) {
        await loadUser()
        setShowVerificationStep(false)
        setUnverifiedEmail('')
        resetForm()
        toast.success('Email verified and logged in!')
        setVerificationError(null)
        localStorage.removeItem('unverifiedEmail')
        localStorage.removeItem('showVerification')
        navigate('/')
      } else {
        setVerificationError(data.error || 'Invalid verification code')
      }
    } catch (err) {
      toast.error('Verification failed:', err)
    } finally {
      setIsVerifyingCode(false)
    }
  }

  const handleResendVerificationCode = async () => {
    setIsVerifyingCode(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: unverifiedEmail }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to resend verification code')

      toast.success('Verification code resent to your email')
    } catch (err) {
      toast.error('Verification failed:', err)
    } finally {
      setIsVerifyingCode(false)
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

  const loadUser = async () => {
    const meRes = await fetch(`${API_BASE_URL}/api/auth/me`, {
      credentials: 'include',
    })
    if (meRes.ok) {
      const userData = await meRes.json()
      setUser(userData)
    }
  }

  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })

      if (!res.ok && res.status !== 401) {
        throw new Error(`Logout failed: ${res.status}`)
      }

      setUser(null)
      navigate('/')
      toast.success('Logged out')
    } catch (err) {
      console.error('❌ Unexpected logout error:', err.message)
      toast.error('Unexpected server error while logging out')
      setUser(null)
      navigate('/')
    }
  }

  const handleForgotPassword = async (email) => {
    setIsRequestingResetCode(true)
    setResetRequestError(null)

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send reset code')

      toast.success('Reset code sent to your email')

      setUnverifiedEmail(email)
      localStorage.setItem('unverifiedEmail', email)

      setTimeout(() => navigate('/auth/reset'), 100)
    } catch (err) {
      setResetRequestError(err.message)
    } finally {
      setIsRequestingResetCode(false)
    }
  }

  const handleResetPassword = async ({ email, code, newPassword }) => {
    setIsResettingPassword(true)
    setResetError('')

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to reset password')

      toast.success('Password reset successful. You can now log in.')
      localStorage.removeItem('unverifiedEmail')
      navigate('/auth/login')
    } catch (err) {
      setResetError(err.message)
    } finally {
      setIsResettingPassword(false)
    }
  }

  const handleResendResetCode = async () => {
    setIsResettingPassword(true)
    setResetError('')
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: unverifiedEmail }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to resend reset code')

      toast.success('Reset code resent to your email')
    } catch (err) {
      setResetError(err.message)
    } finally {
      setIsResettingPassword(false)
    }
  }

  return {
    user,
    setUser,
    formValues,
    setFormValues,
    formErrors,
    setFormErrors,
    selectedCountryCode,
    setSelectedCountryCode,
    handleAuthSubmit,
    handleLogout,
    unverifiedEmail,
    showVerificationStep,
    setShowVerificationStep,
    handleVerificationSubmit,
    isVerifyingCode,
    verificationError,
    isRegistering,
    handleForgotPassword,
    isRequestingResetCode,
    resetRequestError,
    handleResetPassword,
    isResettingPassword,
    resetError,
    setResetStep,
    resetStep,
    handleResendResetCode,
    handleResendVerificationCode,
    isVerifyingLogin,
    setIsVerifyingLogin,
  }
}
