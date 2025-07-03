import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import axios from 'axios'
import FormData from 'form-data'
import authRoutes from './routes/authRoutes.js'
import cookieParser from 'cookie-parser'
import Image from './models/Image.js'
import User from './models/User.js'
import historyRoutes from './routes/historyRoutes.js'
import imageRoutes from './routes/imageRoutes.js'

import { authenticateUser } from './middleware/authMiddleware.js'
import { uploadImageToS3 } from './service/s3.js'

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))
const API_URL = process.env.STABILITY_API_URL

app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', authRoutes)
app.use(authenticateUser)

app.use('/api/images', imageRoutes)
app.use('/api/history', historyRoutes)

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err))



app.post('/generate', async (req, res) => {
  const { prompt } = req.body
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

    const user = await User.findOne({ phoneNumber: req.user.phoneNumber })
    const newImage = await Image.create({
      userId: user._id,
      url: imageUrl,
      prompt,
    })

    console.log('✅ Image generated and saved to DB')
    res.json({ 
    imageUrl: newImage.url,
    prompt: newImage.prompt,
    createdAt: newImage.createdAt 
})
  } catch (err) {
    console.error('❌ Generate error:', err.message)
    res.status(500).json({ error: 'Failed to generate image' })
  }
})


const PORT = 3001
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}` ))
