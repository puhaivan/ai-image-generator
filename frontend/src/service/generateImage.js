import { isValidPrompt } from '../utils/validation'

const VITE_API_URL = import.meta.env.VITE_API_URL

export const generateImage = async ({
  prompt,
  setImageUrl,
  setLoading,
  setPromptError,
  setGenerationError,
  testMode,
  setHistory,
}) => {
  if (!isValidPrompt(prompt, setPromptError)) return
  setPromptError('')
  setLoading(true)

  if (testMode) {
    const placeholderUrl = 'https://placehold.co/512x512?text=Placeholder'
    setTimeout(() => {
      setImageUrl(placeholderUrl)
      setLoading(false)
      setHistory?.((prev) => [
        { prompt, url: placeholderUrl, createdAt: new Date().toISOString() },
        ...prev,
      ])
    }, 3000)
    return
  }

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
