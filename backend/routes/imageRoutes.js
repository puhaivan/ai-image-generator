import express from 'express'
import Image from '../models/Image.js'
import { authenticateUser } from '../middleware/authMiddleware.js'
import { deleteImage } from '../controllers/imageController.js'

const router = express.Router()

router.get('/mine', authenticateUser, async (req, res) => {
  try {
    const images = await Image.find({ userId: req.user.id }).sort({ createdAt: -1 })
    res.json(images)
  } catch (err) {
    console.error('❌ Error fetching images:', err.message)
    res.status(500).json({ error: 'Failed to fetch images' })
  }
})

router.delete('/:id', authenticateUser, deleteImage)

export default router
