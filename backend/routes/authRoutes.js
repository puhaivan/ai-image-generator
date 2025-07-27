import express from 'express'
import { register, login, getMe, logout } from '../controllers/authController.js'

const router = express.Router()

router.post('/register', register)

router.get('/me', getMe)
router.post('/logout', logout)

router.post('/login', login)

export default router
