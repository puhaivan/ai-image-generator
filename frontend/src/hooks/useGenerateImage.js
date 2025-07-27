import { isValidPrompt } from '../utils/validation'
const VITE_API_URL = import.meta.env.VITE_API_URL

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
      const res = await fetch(`${VITE_API_URL}/generate`, {
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
          prompt,
          url: data.imageUrl,
          createdAt: new Date().toISOString(),
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
