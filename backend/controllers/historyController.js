import Image from '../models/Image.js'

export const getUserHistory = async (req, res) => {
  try {
    const images = await Image.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('_id url prompt createdAt')

    res.json(images)
  } catch (err) {
    console.error('❌ History error:', err.message)
    res.status(500).json({ error: 'Failed to fetch history' })
  }
}
