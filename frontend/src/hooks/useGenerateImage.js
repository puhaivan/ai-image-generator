import { isValidPrompt } from '../utils/validation'
import { API_BASE_URL } from '../utils/constants'

export const useGenerateImage = ({
  setImageUrl,
  setLoading,
  setPromptError,
  setGenerationError,
  setHistory,
}) => {
  const handleGenerate = async (prompt) => {
    if (!isValidPrompt(prompt, setPromptError)) return
    setPromptError('')
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE_URL}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ prompt }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')

      setImageUrl(data.imageUrl)
      setHistory?.((prev) => [
        {
          _id: data._id,
          prompt,
          url: data.imageUrl,
          createdAt: data.createdAt,
        },
        ...prev,
      ])
    } catch (err) {
      console.error('Frontend error:', err)
      setGenerationError('❌ Failed to generate image. Please try again.')
      setImageUrl(null)
    } finally {
      setLoading(false)
    }
  }

  return { handleGenerate }
}
