import { useState } from 'react'
import Button from '../button/Button'

function VerificationModalContent({ email, onVerify, isLoading, verificationError }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!/^\d{6}$/.test(code)) {
      setError('Please enter a valid 6-digit code.')
      return
    }

    setError(null)
    onVerify(code)
  }

  return (
    <div className="text-center p-2 sm:p-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-1">Verify your email</h2>
      <p className="text-sm text-gray-600 mb-4">
        We’ve sent a 6-digit code to <span className="font-medium text-gray-800">{email}</span>.
        Please enter it below to confirm your account.
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={6}
          placeholder="Enter 6-digit code"
          className="w-full px-4 py-2 border border-gray-300 rounded-md text-center text-lg tracking-widest focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {!error && verificationError && <p className="text-red-500 text-sm">{verificationError}</p>}

        <Button type="submit" className="w-full mt-1" disabled={isLoading}>
          {isLoading ? 'Verifying...' : 'Verify'}
        </Button>

        {/* Optional: Add resend link */}
        {/* <p className="text-xs text-gray-500 mt-2">
          Didn’t get the code? <span className="text-blue-600 underline cursor-pointer">Resend</span>
        </p> */}
      </form>
    </div>
  )
}

export default VerificationModalContent
