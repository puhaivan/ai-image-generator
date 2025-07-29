import Image from '../models/Image.js'
import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import { s3 } from '../service/s3.js'

export const deleteImage = async (req, res) => {
  console.log('🧪 DELETE params:', req.params)
  console.log('🧪 DELETE req.user:', req.user)
  try {
    const image = await Image.findById(req.params.id)
    if (!image) return res.status(404).json({ error: 'Image not found' })

    if (image.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this image' })
    }

    const key = image.url.split('/').pop()

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
      })
    )

    await image.deleteOne()

    res.json({ message: 'Image deleted successfully' })
  } catch (err) {
    console.error('❌ Delete error:', err.message)
    res.status(500).json({ error: 'Failed to delete image' })
  }
}
