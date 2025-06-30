import { isValidPrompt } from '../utils/validation'

export const generateImage = async ({
  prompt,
  setImageUrl,
  setLoading,
  setPromptError,
  setGenerationError,
  testMode
}) => {
  if (!isValidPrompt(prompt, setPromptError)) return

  setPromptError('')
  setLoading(true)

  if (testMode) {
    setTimeout(() => {
      setImageUrl('https://placehold.co/512x512?text=Placeholder')
      setLoading(false)
    }, 3000)
    return
  }

  try {
    const res = await fetch('http://localhost:3001/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Something went wrong')

    setImageUrl(data.imageUrl)
  } catch (err) {
    console.error('Frontend error:', err)
    setGenerationError('❌ Failed to generate image. Please try again.')
    setImageUrl(null)
  } finally {
    setLoading(false)
  }
}
