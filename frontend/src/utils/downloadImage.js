export const downloadImage = (url) => {
  const link = document.createElement('a')
  link.href = `${import.meta.env.VITE_API_URL}/api/download?url=${encodeURIComponent(url)}`
  link.click()
}
