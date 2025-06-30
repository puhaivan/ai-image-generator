export const isValidPrompt = (text, setPromptError) => {

    const trimmed = text.trim()

  if (trimmed.length == 0){
    setPromptError('⚠️ Please enter a valid prompt')
    return false
  }
  if (trimmed.length <= 3){
    console.log(trimmed.length)
    setPromptError('⚠️ Please enter a valid prompt (too short)')
    return false
  }
  if (/^[^a-zA-Z0-9]+$/.test(trimmed)){
  setPromptError('⚠️ Please enter a valid prompt (no symbols only)')
    return false
  }
  if (/^\d+$/.test(trimmed)) {
    setPromptError('⚠️ Prompt cannot be numbers only')
    return false
  }
  return true
}
