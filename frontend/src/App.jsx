import { useState, useEffect } from 'react'
import PromptInput from './components/input/Input'
import Button from './components/button/Button'
import Spinner from './components/spinner/spinner'
import History from './components/history/History'
import Modal from './components/modal/Modal'
import Login from './pages/Login'
import Register from './pages/Registration'
import Header from './components/Header'

import { downloadImage } from './utils/downloadImage'
import { generateImage } from './service/generateImage'
import { validate } from './utils/formValidation'
import { API_BASE_URL } from './utils/constants'
import { deleteImage } from './utils/deleteImage'

import './App.css'

function App() {
  const [prompt, setPrompt] = useState('')
  const [promptError, setPromptError] = useState('')
  const [generationError, setGenerationError] = useState('')
  const [authType, setAuthType] = useState('register')
  const [modalOpen, setModalOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [testMode, setTestMode] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [user, setUser] = useState(null)

  const [formValues, setFormValues] = useState({
  phoneNumber: { value: '', required: true },
  password: { value: '', required: true },
  firstName: { value: '', required: true },
  lastName: { value: '', required: true },
})
const [formErrors, setFormErrors] = useState({})
const [selectedCountryCode, setSelectedCountryCode] = useState('+1')

  useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
        credentials: 'include',
      })

      if (!res.ok) throw new Error('Not authenticated')

      const data = await res.json()
      setUser(data)
    } catch (err) {
      console.log('❌ Not authenticated:', err.message)
      setUser(null)
    }
  }

  checkAuth()
}, [])

useEffect(() => {
  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/images/mine`, {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setHistory(data)
      }
    } catch (err) {
      console.error('Failed to load history:', err)
    }
  }

  if (user) {
    fetchHistory()
  }
}, [user])


const handleLogOut = async () => {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
    setUser(null)
    setAuthType('login')
  }
const handleAuthSubmit = async (e) => {
  
  e.preventDefault()
  const fieldsToValidate =
  authType === 'login'
    ? ['phoneNumber', 'password']
    : Object.keys(formValues)
  const errors = validate(
  Object.fromEntries(
    Object.entries(formValues).filter(([key]) => fieldsToValidate.includes(key))
  ),
  { ...formErrors }
)
  setFormErrors(errors)

  const hasErrors = Object.keys(errors).length > 0
  if (hasErrors) return

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
    setFormErrors(prev => ({
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
  setFormValues({
    phoneNumber: { value: '', required: true },
    password: { value: '', required: true },
    firstName: { value: '', required: true },
    lastName: { value: '', required: true },
  })
  setFormErrors({})
} catch (err) {
  console.error('Login failed:', err)
  setFormErrors(prev => ({
      ...prev,
      general: 'Something went wrong. Please try again.',
    }))
}
}



  const handleGenerate = async (e) => {
    e.preventDefault()

    await generateImage({
      prompt,
      setPromptError,
      setImageUrl,
      setLoading,
      setGenerationError,
      setHistory,
      testMode,
    })
  }

  const handleCheckboxToggle = () => {
    setTestMode((prev) => !prev)
    setGenerationError('')
  }

  const handleHistoryClick = (item) => {
    setSelectedImage(item)
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
  try {
    await deleteImage(id)
    setHistory(prev => prev.filter(img => img._id !== id))
    setModalOpen(false)
  } catch (err) {
    console.error('❌ Could not delete:', err.message)
  }
}

  const renderResult = () => {
    if (loading) return <Spinner />
    if (generationError) {
      return (
        <div className="max-w-xl mx-auto mt-4 px-4">
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded">
            <img src="/images/error-icon.svg" alt="Error" className="w-5 h-5 shrink-0" />
            <span>{generationError}</span>
          </div>
        </div>
      )
    }
    if (imageUrl) {
      return <img src={imageUrl} alt="Generated" className="w-full h-full object-cover" />
    }
    return <p className="text-gray-400 italic">Your generated image will appear here</p>
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 px-4 py-8">
      <Header
  user={user}
  setAuthType={setAuthType}
  setUser={setUser}
  authType={authType}
  setAuthOpen={setAuthOpen}
  setFormValues={setFormValues}
  setFormErrors={setFormErrors}
  setSelectedCountryCode={setSelectedCountryCode}
  onLogout={handleLogOut}
/>


      <h1 className="text-4xl font-bold text-center mb-4">AI Image Generator</h1>
      <p className="text-center mb-8 text-gray-600">Turn words into art</p>

      {authOpen && (
  <Modal onClose={() => setAuthOpen(false)}>
    {authType === 'login' ? (
      <Login
        formValues={formValues}
        setFormValues={setFormValues}
        formErrors={formErrors}
        onSubmit={handleAuthSubmit}
        switchAuthType={() => {
          setAuthType('register')
          setFormErrors({})
        }}
      />
    ) : (
      <Register
        formValues={formValues}
        setFormValues={setFormValues}
        formErrors={formErrors}
        selectedCountryCode={selectedCountryCode}
        setSelectedCountryCode={setSelectedCountryCode}
        onSubmit={handleAuthSubmit}
        switchAuthType={() => {
          setAuthType('login')
          setFormErrors({})
        }}
      />
    )}
  </Modal>
)}


    {user ? (
  <>
      <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-xl">
        <form onSubmit={handleGenerate}>
          <PromptInput
            label="Your Prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. robot playing guitar"
            error={promptError}
            disabled={loading}
          />

          {promptError && (
            <span className="ml-2 block text-red-500 text-xs font-normal align-middle">
              {promptError}
            </span>
          )}

          <label className="flex items-center mt-4 cursor-pointer text-sm text-gray-700 gap-2 my-2.5">
            <span>Test Mode (no credits)</span>
            <input
              type="checkbox"
              checked={testMode}
              onChange={handleCheckboxToggle}
              className="ml-2 h-4 w-4 accent-blue-600 rounded border"
            />
          </label>

          <Button type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Image'}
          </Button>
        </form>
      </div>

      <div className="max-w-xl mx-auto mt-8 text-center">
        <div className={`w-full h-[512px] bg-white rounded-xl shadow-inner flex items-center justify-center overflow-hidden border-2 ${generationError ? 'border-red-400' : 'border-gray-300'}`}>
          {renderResult()}
        </div>

        {imageUrl && (
          <div className="flex justify-center mt-4">
            <Button onClick={() => downloadImage(imageUrl, prompt || 'ai-image')}>
              Download Image
            </Button>
          </div>
        )}

        {user &&<History history={history} onClick={handleHistoryClick} />}

      </div>
       </>
) : (
  <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg text-center">
    <h3 className="text-xl font-semibold text-gray-800 mb-2">Want to generate your image?</h3>
    <p className="text-gray-600 mb-4">
      Log in to your account to begin implementing your imagination and create amazing AI art.
    </p>
    <Button onClick={() => setAuthOpen(true)}>Login to Start</Button>
  </div>
)}

      {modalOpen && selectedImage && (
        
        <Modal onClose={() => setModalOpen(false)}>
          <img src={selectedImage.url} alt={selectedImage.prompt} className="w-full rounded mb-4 p-2.5" />
          <p className="text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded px-3 py-2 mb-4 font-medium shadow-inner">
            {selectedImage.prompt}
          </p>
          <div className="flex justify-end">
            <Button onClick={() => downloadImage(selectedImage.url, selectedImage.prompt || 'ai-image')}>
              Download
            </Button>
          </div>
         <div className="flex justify-center my-2.5">
  <Button
    variant="danger"
    onClick={(e) => {
      e.stopPropagation()
      handleDelete(selectedImage._id)
    }}
    className="mt-2 w-full"
  >
    <span className="inline-flex justify-center items-center gap-2 w-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 7L5 7M10 11v6M14 11v6M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"
        />
      </svg>
      Delete
    </span>
  </Button>
</div>
        </Modal>
      )}
      
    </div>
  )
}

export default App
