export const downloadImage = (filename) => {
  const link = document.createElement('a')
  link.href = `${import.meta.env.VITE_API_URL}/api/download/${filename}`
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
