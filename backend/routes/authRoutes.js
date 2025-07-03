import express from 'express'
import { register, login, getMe, logout } from '../controllers/authController.js'
import { authenticateUser } from '../middleware/authMiddleware.js'


const router = express.Router()


router.post('/register', register)

router.get('/me', authenticateUser, getMe)
router.post('/logout', logout)

router.post('/login', login)

export default router
