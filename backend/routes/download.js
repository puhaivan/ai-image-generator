import express from 'express'
import fetch from 'node-fetch'

const router = express.Router()

router.get('/:filename', async (req, res) => {
  try {
    const { filename } = req.params
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${filename}`

    const response = await fetch(fileUrl)
    if (!response.ok) throw new Error('File not found on S3')

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.setHeader(
      'Content-Type',
      response.headers.get('content-type') || 'application/octet-stream'
    )

    const buffer = await response.arrayBuffer()
    res.send(Buffer.from(buffer))
  } catch (err) {
    console.error('❌ File download failed:', err)
    res.status(404).json({ error: 'File not found' })
  }
})

export default router
