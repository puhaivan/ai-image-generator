import { API_BASE_URL } from './constants'

export const deleteImage = async (id) => {
  const res = await fetch(`${API_BASE_URL}/api/images/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!res.ok) throw new Error('Failed to delete image')
}
