import express from 'express'
import fetch from 'node-fetch'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const fileUrl = req.query.url
    if (!fileUrl) return res.status(400).json({ error: 'Missing url' })

    const response = await fetch(fileUrl)

    if (!response.ok) {
      console.warn(`⚠️ File not found or inaccessible: ${fileUrl}`)
      return res.status(404).json({ error: 'File not found' })
    }

    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition')
    res.setHeader('Content-Disposition', `attachment; filename="${Date.now()}.jpg"`)
    res.setHeader(
      'Content-Type',
      response.headers.get('content-type') || 'application/octet-stream'
    )
    response.body.pipe(res)
  } catch (err) {
    console.error('❌ File download failed:', err.message)
    res.status(500).json({ error: 'Download failed' })
  }
})

export default router
