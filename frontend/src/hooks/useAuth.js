import { useEffect, useState } from 'react'
import { API_BASE_URL } from '../utils/constants'
import { validate } from '../utils/formValidation'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [authType, setAuthType] = useState('register')
  const [authOpen, setAuthOpen] = useState(false)
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
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
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
    const authOpenParam = searchParams.get('authOpen')
    if (authOpenParam === 'login') {
      setAuthType('login')
      setAuthOpen(true)
    } else if (authOpenParam === 'register') {
      setAuthType('register')
      setAuthOpen(true)
    }

    const localEmail = localStorage.getItem('pendingEmail')
    const shouldVerify = localStorage.getItem('showVerification') === 'true'

    if (shouldVerify && localEmail) {
      setPendingEmail(localEmail)
      setShowVerification(true)
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
      setAuthOpen(false)
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

    if (authType === 'login') {
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
        setAuthOpen(false)
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
      console.error('Verification failed:', err)
      toast.error('Verification failed')
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
    setAuthType('login')
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
      setForgotEmail(email)

      setShowForgotPassword(false)
      setShowResetModal(true)
      setResetStep('verify')
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

      if (!res.ok) throw new Error(data.error || 'Failed to reset password')

      toast.success('Password reset successful. You can now log in.')
      setShowResetModal(false)
      setAuthType('login')
    } catch (err) {
      setResetError(err.message)
    } finally {
      setResetting(false)
    }
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
    resetStep,
    setShowForgotPassword,
    showForgotPassword,
    showResetModal,
    setShowResetModal,
    forgotEmail,
    setForgotEmail,
    handleResetPassword,
    resetting,
    resetError,
    setResetStep,
  }
}
