import express from 'express'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const fileUrl = req.query.url
    if (!fileUrl) return res.status(400).json({ error: 'Missing url' })

    const response = await fetch(fileUrl)
    if (!response.ok) throw new Error('File not found')

    res.setHeader('Content-Disposition', `attachment; filename="${Date.now()}.jpg"`)
    res.setHeader(
      'Content-Type',
      response.headers.get('content-type') || 'application/octet-stream'
    )

    const buffer = await response.arrayBuffer()
    res.send(Buffer.from(buffer))
  } catch (err) {
    console.error('❌ File download failed:', err)
    res.status(500).json({ error: 'Download failed' })
  }
})

export default router
