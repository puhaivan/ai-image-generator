import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import AuthSuccess from './pages/AuthSuccess'
import Button from './components/button/Button'
import Spinner from './components/spinner/spinner'
import Modal from './components/modal/Modal'
import Header from './components/Header'
import GenerationError from './components/forms/GenerationError'
import GenerateForm from './components/forms/GenerateForm'
import UserPanel from './components/userPanel/UserPanel'
import MobileUserPanel from './components/userPanel/MobileUserPanel'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegistrationPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import EmailVerifyPage from './pages/EmailVerifyPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import Footer from './components/Footer'
import Interactive3D from './components/Interactive3D'
import CookieConsent from './components/modal/CookieConsentModal'

import { downloadImage } from './utils/downloadImage'
import { useGenerateImage } from './hooks/useGenerateImage'
import { useAuth } from './context/AuthContext'
import { useHistory } from './hooks/useHistory'
import { ToastContainer } from 'react-toastify'

import trashIcon from '/images/trash-bin-icon.svg'

import './App.css'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const {
    user,
    authType,
    setAuthType,
    setAuthOpen,
    setFormValues,
    setFormErrors,
    setSelectedCountryCode,
    handleLogout,
  } = useAuth()

  const {
    history,
    setHistory,
    selectedImage,
    modalOpen,
    setModalOpen,
    handleHistoryClick,
    handleDelete,
    deleting,
  } = useHistory(user)

  const [prompt, setPrompt] = useState('')
  const [promptError, setPromptError] = useState('')
  const [generationError, setGenerationError] = useState('')
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false)
  const [isCookieConsentOpen, setIsCookieConsentOpen] = useState(false)
  const [isContactOpen, setIsContactOpen] = useState(false)

  const { handleGenerate } = useGenerateImage({
    setImageUrl,
    setLoading,
    setPromptError,
    setGenerationError,
    setHistory,
  })

  const renderResult = () => {
    if (loading) return <Spinner />
    if (generationError) {
      return <GenerationError error={generationError} />
    }
    if (imageUrl) {
      return <img src={imageUrl} alt="Generated" className="w-full h-full object-cover" />
    }
    return <p className="text-gray-400 italic">Your generated image will appear here</p>
  }

  return (
    <>
      <Header
        user={user}
        authType={authType}
        setAuthType={setAuthType}
        setAuthOpen={setAuthOpen}
        setFormValues={setFormValues}
        setFormErrors={setFormErrors}
        setSelectedCountryCode={setSelectedCountryCode}
        setMobilePanelOpen={setMobilePanelOpen}
      />
      <Routes>
        <Route
          path="/"
          element={
            <div>
              {user && (
                <MobileUserPanel
                  open={mobilePanelOpen}
                  setOpen={setMobilePanelOpen}
                  user={user}
                  handleLogout={handleLogout}
                />
              )}
              <div className="flex">
                <UserPanel user={user} handleLogout={handleLogout} />

                <div className="flex-1 p-4">
                  <div className=" bg-gray-100 text-gray-900 px-4 py-8">
                    <h1 className="text-4xl font-bold text-center mb-4">AI Image Generator</h1>
                    <p className="text-center mb-8 text-gray-600">Turn words into art</p>

                    <GenerateForm
                      user={user}
                      handleGenerate={(e) => {
                        e.preventDefault()
                        handleGenerate(prompt)
                      }}
                      loading={loading}
                      imageUrl={imageUrl}
                      generationError={generationError}
                      setPrompt={setPrompt}
                      promptError={promptError}
                      handleHistoryClick={handleHistoryClick}
                      renderResult={renderResult}
                      history={history}
                      downloadImage={downloadImage}
                    />

                    {modalOpen && selectedImage && (
                      <Modal onClose={() => setModalOpen(false)}>
                        <img
                          src={selectedImage.url}
                          alt={selectedImage.prompt}
                          className="w-full rounded mb-4 p-2.5"
                        />
                        <p className="text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded px-3 py-2 mb-4 font-medium shadow-inner">
                          {selectedImage.prompt}
                        </p>
                        <div className="flex justify-end">
                          <Button
                            onClick={() =>
                              downloadImage(selectedImage.url, selectedImage.prompt || 'ai-image')
                            }
                          >
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
                            disabled={deleting}
                          >
                            <span className="inline-flex justify-center items-center gap-2 w-full">
                              {deleting ? (
                                <Spinner size="sm" message="" />
                              ) : (
                                <>
                                  Delete
                                  <img src={trashIcon} className="w-4 h-4" alt="Trash Icon" />
                                </>
                              )}
                            </span>
                          </Button>
                        </div>
                      </Modal>
                    )}
                  </div>
                </div>
              </div>
            </div>
          }
        />
        <Route path="/auth-success" element={<AuthSuccess />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/verify" element={<EmailVerifyPage />} />
        <Route path="/auth/reset" element={<ResetPasswordPage />} />
        <Route
          path="/privacy-policy"
          element={<PrivacyPolicy setContactOpen={setIsContactOpen} />}
        />
        <Route
          path="/terms-of-service"
          element={<TermsOfService setContactOpen={setIsContactOpen} />}
        />
      </Routes>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{
          borderRadius: '0.75rem',
          background: 'linear-gradient(135deg, #ffffff, #f0f7ff)',
          color: '#1f3b73',
          border: '1px solid #d0e5ff',
          boxShadow: '0 0 10px rgba(31, 59, 115, 0.15)',
          fontWeight: 500,
        }}
        bodyClassName="text-sm"
        progressClassName="bg-blue-500"
      />
      <Interactive3D />
      <Footer contactOpen={isContactOpen} setContactOpen={setIsContactOpen} />
      <CookieConsent isOpen={isCookieConsentOpen} setIsOpen={setIsCookieConsentOpen} />
    </>
  )
}

export default App
