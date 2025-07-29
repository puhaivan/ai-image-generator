import { useEffect, useState } from 'react'
import { API_BASE_URL } from '../utils/constants'
import { deleteImage } from '../utils/deleteImage'

export const useHistory = (user) => {
  const [history, setHistory] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/images/mine`, {
          credentials: 'include',
        })
        if (res.ok) {
          const data = await res.json()
          setHistory(data)
        }
      } catch (err) {
        console.error('❌ Failed to load history:', err)
      }
    }

    if (user) {
      fetchHistory()
    }
  }, [user])

  const handleHistoryClick = (item) => {
    if (!item || !item._id) {
      console.warn('⚠️ Cannot open modal: image is missing _id', item)
      return
    }

    setSelectedImage(item)
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!id || typeof id !== 'string') {
      console.error('❌ Cannot delete image: ID is missing or invalid')
      return
    }

    try {
      await deleteImage(id)
      setHistory((prev) => prev.filter((img) => img._id !== id))
      setModalOpen(false)
    } catch (err) {
      console.error('❌ Could not delete image:', err.message)
    }
  }

  return {
    history,
    setHistory,
    selectedImage,
    setSelectedImage,
    modalOpen,
    setModalOpen,
    handleHistoryClick,
    handleDelete,
  }
}
