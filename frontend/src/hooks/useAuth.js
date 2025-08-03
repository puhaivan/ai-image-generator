import { useEffect, useState } from 'react'
import { API_BASE_URL } from '../utils/constants'
import { validate } from '../utils/formValidation'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  const [selectedCountryCode, setSelectedCountryCode] = useState('+1')
  const [searchParams] = useSearchParams()
  const [showVerification, setShowVerification] = useState(false)
  const [pendingEmail, setPendingEmail] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [verificationError, setVerificationError] = useState(null)
  const [registering, setRegistering] = useState(false)
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotError, setForgotError] = useState(null)
  const [resetStep, setResetStep] = useState('request')

  const [resetting, setResetting] = useState(false)
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
    const localEmail = localStorage.getItem('pendingEmail')
    const shouldVerify = localStorage.getItem('showVerification') === 'true'

    if (shouldVerify && localEmail) {
      setPendingEmail(localEmail)
      setShowVerification(true)
    } else if (localEmail) {
      setPendingEmail(localEmail)
    }
  }, [searchParams])

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
          setPendingEmail(data.email)
          setShowVerification(true)
        }
        throw new Error('Email not verified')
      }

      if (!res.ok) throw new Error('Not authenticated')

      const data = await res.json()
      setUser(data)
    } catch (err) {
      console.error('Auth check failed:', err.message)
      setUser(null)
    }
  }

  const handleLogin = async (credentials) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(credentials),
    })

    const data = await res.json()

    if (res.status === 200 && data.requiresVerification) {
      setPendingEmail(data.email)
      setShowVerification(true)
      return
    }

    if (res.ok) {
      await loadUser()
      toast.success('Login successful')
      navigate('/')
    } else {
      setFormErrors((prev) => ({
        ...prev,
        general: data.error || 'Something went wrong',
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
        setRegistering(true)
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
        setPendingEmail(payload.email)
        setShowVerification(true)
        localStorage.setItem('pendingEmail', payload.email)
        localStorage.setItem('showVerification', 'true')
        navigate('/auth/verify')
      } catch (err) {
        console.error('Registration failed:', err)
        setFormErrors((prev) => ({
          ...prev,
          general: 'Something went wrong. Please try again.',
        }))
      } finally {
        setRegistering(false)
      }
    }
  }

  const handleVerificationSubmit = async (code) => {
    setVerifying(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: pendingEmail, code }),
      })

      const data = await res.json()

      if (res.ok) {
        await loadUser()
        setShowVerification(false)
        setPendingEmail('')
        resetForm()
        toast.success('Email verified and logged in!')
        setVerificationError(null)
        localStorage.removeItem('pendingEmail')
        localStorage.removeItem('showVerification')
        navigate('/')
      } else {
        setVerificationError(data.error || 'Invalid verification code')
      }
    } catch (err) {
      toast.error('Verification failed:', err)
    } finally {
      setVerifying(false)
    }
  }

  const handleResendVerificationCode = async () => {
    setVerifying(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: pendingEmail }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to resend verification code')

      toast.success('Verification code resent to your email')
    } catch (err) {
      toast.error('Verification failed:', err)
    } finally {
      setVerifying(false)
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
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })

    setUser(null)
    navigate('/')
    toast.success('Logged out')
  }

  const handleForgotPassword = async (email) => {
    setForgotLoading(true)
    setForgotError(null)

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to send reset code')

      toast.success('Reset code sent to your email')
      setPendingEmail(email)
      localStorage.setItem('pendingEmail', email)
      console.log('Navigating to /auth/reset')
      navigate('/auth/reset')
    } catch (err) {
      setForgotError(err.message)
    } finally {
      setForgotLoading(false)
    }
  }

  const handleResetPassword = async ({ email, code, newPassword }) => {
    setResetting(true)
    setResetError('')

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success('Password reset successful. You can now log in.')
        localStorage.removeItem('pendingEmail')
        navigate('/auth/login')
      } else if (res.status === 400) {
        setResetError(data.error || 'New password cannot be the same as your old password')
      } else {
        setResetError(data.error || 'Failed to reset password. Please try again.')
      }
    } catch (err) {
      setResetError(err.message)
    } finally {
      setResetting(false)
    }
  }

  const handleResendResetCode = async () => {
    setResetting(true)
    setResetError('')
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingEmail }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to resend reset code')

      toast.success('Reset code resent to your email')
    } catch (err) {
      setResetError(err.message)
    } finally {
      setResetting(false)
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
    pendingEmail,
    showVerification,
    setShowVerification,
    handleVerificationSubmit,
    verifying,
    verificationError,
    registering,
    handleForgotPassword,
    forgotLoading,
    forgotError,
    handleResetPassword,
    resetting,
    resetError,
    setResetStep,
    resetStep,
    handleResendResetCode,
    handleResendVerificationCode,
  }
}
