// src/App.jsx
import PromptInput from './components/PromptInput'
import ImageCard from './components/ImageCard'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-4">AI Image Generator</h1>
      <p className="text-center mb-8 text-gray-600">Turn words into art</p>

      <div className="max-w-xl mx-auto">
        <PromptInput />
      </div>

      <div className="max-w-xl mx-auto mt-8">
        <ImageCard />
      </div>
    </div>
  )
}

export default App
