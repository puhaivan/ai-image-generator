import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'
import Button from '../components/button/Button'
import Spinner from '../components/spinner/spinner'

function VerifyPage() {
  const {
    pendingEmail,
    handleVerificationSubmit,
    verifying,
    verificationError,
    handleResendVerificationCode,
  } = useAuth()

  const [code, setCode] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!/^\d{6}$/.test(code)) {
      setError('Please enter a valid 6-digit code.')
      return
    }

    setError(null)
    handleVerificationSubmit(code)
  }

  if (!pendingEmail) return <Navigate to="/" />

  return (
    <div className="flex items-center justify-center px-4 py-12 bg-gradient-to-tr from-blue-50 to-purple-100">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">Verify Your Email</h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          We’ve sent a 6-digit code to{' '}
          <span className="font-medium text-gray-800">{pendingEmail}</span>. Enter it below:
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            placeholder="Enter 6-digit code"
            className="w-full px-4 py-3 border border-gray-300 rounded-md text-center text-lg tracking-widest focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {!error && verificationError && (
            <p className="text-red-500 text-sm text-center">{verificationError}</p>
          )}

          <Button type="submit" className="w-full" disabled={verifying}>
            {verifying ? <Spinner size={3} message="" /> : 'Verify'}
          </Button>

          <p
            className="text-sm text-center text-blue-600 hover:underline mt-2 cursor-pointer"
            onClick={handleResendVerificationCode}
          >
            Resend Code
          </p>
        </form>
      </div>
    </div>
  )
}

export default VerifyPage
