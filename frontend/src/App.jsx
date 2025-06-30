import { useState } from 'react'
import PromptInput from './components/input/PromptInput'
import Button from './components/button/Button'
import Spinner from './components/spinner/spinner'
import History from './components/history/History'
import Modal from './components/modal/Modal'

import { downloadImage } from './utils/downloadImage'
import { generateImage } from './service/generateImage'

import './App.css'

function App() {
  const [prompt, setPrompt] = useState('')
  const [promptError, setPromptError] = useState('')
  const [generationError, setGenerationError] = useState('')

  const [history, setHistory] = useState([])

  const [loading, setLoading] = useState(false)
  const [testMode, setTestMode] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  const [selectedImage, setSelectedImage] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)


  const handleHistoryClick = (item) => {
  setSelectedImage(item)
  setModalOpen(true)
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
      <h1 className="text-4xl font-bold text-center mb-4">AI Image Generator</h1>
      <p className="text-center mb-8 text-gray-600">Turn words into art</p>

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
        <div
          className={`w-full h-[512px] bg-white rounded-xl shadow-inner flex items-center justify-center overflow-hidden border-2 ${
            generationError ? 'border-red-400' : 'border-gray-300'
          }`}
        >
          {renderResult()}
        </div>

        {imageUrl && (
          <div className="flex justify-center mt-4">
            <Button onClick={() => downloadImage(imageUrl, prompt || 'ai-image')}>
              Download Image
            </Button>
          </div>
        )}
        <History
         history={history}
         onClick={handleHistoryClick} />
      </div>
      {modalOpen && selectedImage && (
  <Modal onClose={() => setModalOpen(false)}>
    <img src={selectedImage.url} alt={selectedImage.prompt} className="w-full rounded mb-4" />
    <p className="text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded px-3 py-2 mb-4 font-medium shadow-inner">
  {selectedImage.prompt}
    </p>
    <div className="flex justify-end">
      <Button onClick={() => downloadImage(selectedImage.url, selectedImage.prompt || 'ai-image')}>
        Download
      </Button>
    </div>
  </Modal>
)}
    </div>
  )
}

export default App
