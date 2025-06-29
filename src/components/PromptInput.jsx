import { useState } from 'react'

function PromptInput() {
  const [prompt, setPrompt] = useState('')

  const handleGenerate = () => {
    // Placeholder - we’ll wire this to backend later
    console.log('Generate image for:', prompt)
  }

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your image..."
        className="w-full border border-gray-300 rounded-lg p-3"
      />
      <button
        onClick={handleGenerate}
        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
      >
        Generate
      </button>
    </div>
  )
}

export default PromptInput
