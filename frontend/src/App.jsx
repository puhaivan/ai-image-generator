import { useState } from 'react'
import PromptInput from './components/input/PromptInput'
import Button from './components/button/Button'
import './App.css'

function App() {
  const [prompt, setPrompt] = useState('')
  const [imageUrl, setImageUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [testMode, setTestMode] = useState(true)

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!prompt) return
    setLoading(true)

    if (testMode) {
    setImageUrl('https://placehold.co/512x512?text=Placeholder') // Placeholder image
    setLoading(false)
    return
  }

    try {
      const res = await fetch('http://localhost:3001/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      setImageUrl(data.imageUrl)
    } catch (err) {
      console.error('Frontend error:', err)
    } finally {
      setLoading(false)
    }
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
  />
  
  <label className="block mt-4">
    <input
      type="checkbox"
      checked={testMode}
      onChange={() => setTestMode(!testMode)}
    />
    <span className="ml-2">Test Mode (no credits)</span>
  </label>

  <Button type="submit" disabled={loading}>
    {loading ? 'Generating...' : 'Generate Image'}
  </Button>
</form>

      </div>

      <div className="max-w-xl mx-auto mt-8 text-center">
  <div className="w-full h-[512px] bg-white border border-gray-300 rounded-xl shadow-inner flex items-center justify-center overflow-hidden">
    {imageUrl ? (
      <img
        src={imageUrl}
        alt="Generated"
        className="w-full h-full object-cover"
      />
    ) : (
      <p className="text-gray-400 italic">Your generated image will appear here</p>
    )}
  </div>
</div>

    </div>
  )
}

export default App
