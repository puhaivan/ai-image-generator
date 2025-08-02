import express from 'express'
import sendEmail from '../utils/sendEmail.js'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' })
    }
    await sendEmail(
      process.env.EMAIL_USER,
      `New Contact Form Message from ${name}`,
      `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`
    )

    res.json({ message: 'Email sent successfully!' })
  } catch (err) {
    console.error('❌ Contact form error:', err.message)
    res.status(500).json({ error: 'Failed to send email' })
  }
})

export default router
