import Input from './input/Input'
import Button from './button/Button'
import History from './history/History'
import { useNavigate } from 'react-router-dom'

function GenerateForm({
  user,
  handleGenerate,
  setPrompt,
  prompt,
  promptError,
  loading,
  renderResult,
  imageUrl,
  downloadImage,
  handleHistoryClick,
  generationError,
  history,
}) {
  const navigate = useNavigate() // INIT NAVIGATION

  if (!user) {
    return (
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Want to generate your image?</h3>
        <p className="text-gray-600 mb-4">
          Log in to your account to begin implementing your imagination and create amazing AI art.
        </p>
        <Button
          onClick={() => {
            navigate('/auth/login') // REDIRECT TO LOGIN PAGE
          }}
        >
          Login to Start
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-xl">
        <form onSubmit={handleGenerate}>
          <Input
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
          <Button type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Image'}
          </Button>
        </form>
      </div>

      <div className="max-w-xl mx-auto mt-8 text-center">
        <div
          className={`w-full h-[512px] bg-white rounded-xl shadow-inner flex items-center justify-center overflow-hidden border-2 ${generationError ? 'border-red-400' : 'border-gray-300'}`}
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

        {user && <History history={history} onClick={handleHistoryClick} />}
      </div>
    </>
  )
}

export default GenerateForm
