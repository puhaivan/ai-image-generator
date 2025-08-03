import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const isProduction = process.env.NODE_ENV === 'production'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '.env') })

import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import axios from 'axios'
import FormData from 'form-data'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import passport from 'passport'
import './auth/google.js'

import authGoogleRoutes from './routes/authGoogle.js'
import authRoutes from './routes/authRoutes.js'
import imageRoutes from './routes/imageRoutes.js'
import historyRoutes from './routes/historyRoutes.js'
import contactRoutes from './routes/contactRoutes.js'

import { authenticateUser } from './middleware/authMiddleware.js'
import { uploadImageToS3 } from './service/s3.js'
import Image from './models/Image.js'
import User from './models/User.js'

const app = express()
const PORT = process.env.PORT || 3001

const API_URL = process.env.STABILITY_API_URL

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
)

app.use(express.json())
app.use(cookieParser())
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'supersecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProduction,
      httpOnly: true,
      sameSite: isProduction ? 'strict' : 'lax',
    },
  })
)

app.use(passport.initialize())
app.use(passport.session())

app.use('/api/auth', authRoutes)
app.use('/auth', authGoogleRoutes)
app.use('/api/images', authenticateUser, imageRoutes)
app.use('/api/history', authenticateUser, historyRoutes)
app.use('/api/contact', contactRoutes)

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err))

app.post('/generate', authenticateUser, async (req, res) => {
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

    res.json({
      imageUrl: newImage.url,
      prompt: newImage.prompt,
      createdAt: newImage.createdAt,
      _id: newImage._id,
    })
  } catch (err) {
    console.error('❌ Image generation error:', err)
    res.status(500).json({ error: 'Failed to generate image' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
