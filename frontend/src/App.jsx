import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import AuthSuccess from './pages/AuthSuccess'
import Button from './components/button/Button'
import Spinner from './components/spinner/spinner'
import Modal from './components/modal/Modal'
import VerificationModalContent from './components/modal/VerificationModalContent'
import Login from './pages/Login'
import Registration from './pages/Registration'
import Header from './components/Header'
import GenerationError from './components/GenerationError'
import GenerateForm from './components/GenerateForm'
import UserPanel from './components/userPanel/UserPanel'
import MobileUserPanel from './components/userPanel/MobileUserPanel'
import ForgotPassword from './components/modal/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

import { downloadImage } from './utils/downloadImage'
import { useGenerateImage } from './hooks/useGenerateImage'
import { useAuth } from './hooks/useAuth'
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
    showVerification,
    setShowVerification,
    pendingEmail,
    handleVerificationSubmit,
    verifying,
    verificationError,
    registering,
    showForgotPassword,
    setShowForgotPassword,
    handleForgotPassword,
    forgotLoading,
    forgotError,
    showResetModal,
    setShowResetModal,
    forgotEmail,
    handleResetPassword,
    resetting,
    resetError,
    resetStep,
    setResetStep,
  } = useAuth()

  const {
    history,
    setHistory,
    selectedImage,
    modalOpen,
    setModalOpen,
    handleHistoryClick,
    handleDelete,
  } = useHistory(user)

  const [prompt, setPrompt] = useState('')
  const [promptError, setPromptError] = useState('')
  const [generationError, setGenerationError] = useState('')
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false)

  const { handleGenerate } = useGenerateImage({
    setImageUrl,
    setLoading,
    setPromptError,
    setGenerationError,
    setHistory,
  })

  console.log('authOpen:', authOpen)
  console.log('showForgotPassword:', showForgotPassword)
  console.log('showResetModal:', showResetModal)
  console.log('resetStep:', resetStep)

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
      <Routes>
        <Route
          path="/"
          element={
            <div>
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
                  <div className="min-h-screen bg-gray-100 text-gray-900 px-4 py-8">
                    <h1 className="text-4xl font-bold text-center mb-4">AI Image Generator</h1>
                    <p className="text-center mb-8 text-gray-600">Turn words into art</p>

                    {showForgotPassword && resetStep === 'request' && (
                      <Modal onClose={() => setShowForgotPassword(false)}>
                        <ForgotPassword
                          onSubmit={handleForgotPassword}
                          isLoading={forgotLoading}
                          error={forgotError}
                          onBackToLogin={() => {
                            setShowForgotPassword(false)
                            setAuthOpen(true)
                            setAuthType('login')
                          }}
                        />
                      </Modal>
                    )}

                    {showResetModal && resetStep === 'verify' && (
                      <Modal onClose={() => setShowResetModal(false)}>
                        <ResetPassword
                          email={forgotEmail}
                          onSubmit={handleResetPassword}
                          isLoading={resetting}
                          error={resetError}
                        />
                      </Modal>
                    )}

                    {authOpen && !showForgotPassword && !showResetModal && (
                      <Modal
                        onClose={() => {
                          setAuthOpen(false)
                          setAuthType('login')
                        }}
                      >
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
                            setAuthOpen={setAuthOpen}
                            setShowForgotPassword={setShowForgotPassword}
                            setResetStep={setResetStep}
                            setShowResetModal={setShowResetModal}
                          />
                        ) : (
                          <Registration
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
                            loading={registering}
                          />
                        )}
                      </Modal>
                    )}

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
                      setAuthOpen={setAuthOpen}
                      history={history}
                      downloadImage={downloadImage}
                      setAuthType={setAuthType}
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
                          >
                            <span className="inline-flex justify-center items-center gap-2 w-full">
                              Delete
                              <img src={trashIcon} className="w-4 h-4" alt="Trash Icon" />
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

      {showVerification && (
        <Modal onClose={() => setShowVerification(false)}>
          <VerificationModalContent
            email={pendingEmail}
            onVerify={handleVerificationSubmit}
            isLoading={verifying}
            verificationError={verificationError}
          />
        </Modal>
      )}
    </>
  )
}

export default App
