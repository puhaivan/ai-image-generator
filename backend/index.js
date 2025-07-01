import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import axios from 'axios'
import FormData from 'form-data'
import { uploadImageToS3 } from './service/s3.js'


const app = express()
const API_URL = process.env.STABILITY_API_URL

app.use(cors())
app.use(express.json())

app.post('/generate', async (req, res) => {
  
  const { prompt } = req.body
  console.log('🟡 Prompt received:', prompt)

  if (!prompt) return res.status(400).json({ error: 'Prompt is required' })

  try {
    const form = new FormData()
    form.append('prompt', prompt)
    form.append('output_format', 'jpeg')
    form.append('mode', 'text-to-image')
    form.append('response_format', 'base64')
    form.append('aspect_ratio', '1:1')

    const response = await axios.post(API_URL, form, {
      headers: {
        Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
        ...form.getHeaders(),
      },
    })

    const imageBase64 = response.data.image
    const imageUrl = await uploadImageToS3(imageBase64, prompt)

    console.log('✅ Image generated successfully')
    res.json({ imageUrl })
  } catch (err) {
    console.error('❌ Stability error:', err.response?.data || err.message)
    res.status(500).json({ error: 'Failed to generate image' })
  }
})

const PORT = 3001
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}` ))
