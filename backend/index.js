const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const axios = require('axios')
const FormData = require('form-data')
const app = express()


app.use(cors())
app.use(express.json())
dotenv.config()


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

    const response = await axios.post(
      'https://api.stability.ai/v2beta/stable-image/generate/core',
      form,
      {
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          ...form.getHeaders(),
        },
      }
    )

    const imageBase64 = response.data.image
    const imageUrl = `data:image/jpeg;base64,${imageBase64}`

    console.log('✅ Image generated successfully')
    res.json({ imageUrl })
  } catch (err) {
    console.error('❌ Stability error:', err.response?.data || err.message)
    res.status(500).json({ error: 'Failed to generate image' })
  }
})


const PORT = 3001
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`))
