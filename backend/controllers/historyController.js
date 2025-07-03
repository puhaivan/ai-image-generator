import Image from '../models/Image.js'
import User from '../models/User.js'

export const getUserHistory = async (req, res) => {
  try {
    const user = await User.findOne({ phoneNumber: req.user.phoneNumber })
    if (!user) return res.status(404).json({ error: 'User not found' })

   const images = await Image.find({ userId: req.user.id })
  .sort({ createdAt: -1 })
  .select('url prompt createdAt')

    res.json(images)
  } catch (err) {
    console.error('❌ History error:', err.message)
    res.status(500).json({ error: 'Failed to fetch history' })
  }
}
