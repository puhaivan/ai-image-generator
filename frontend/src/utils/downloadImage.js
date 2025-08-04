export const downloadImage = (url, filename = `image-${Date.now()}`) => {
  const link = document.createElement('a')
  link.href = `${import.meta.env.VITE_API_URL}/api/download?url=${encodeURIComponent(url)}`
  link.setAttribute('download', `${filename}.jpg`)
  link.style.display = 'none'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
