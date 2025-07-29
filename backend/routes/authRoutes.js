import express from 'express'
import {
  register,
  login,
  getMe,
  logout,
  changePassword,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js'
import { authenticateUser } from '../middleware/authMiddleware.js'
const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', getMe)
router.post('/logout', logout)
router.post('/change-password', authenticateUser, changePassword)

router.post('/verify', verifyEmail)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

export default router
