import jwt from 'jsonwebtoken'
import User from '../models/User.js'


const isProduction = process.env.NODE_ENV === 'production'

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, phoneNumber: user.phoneNumber },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}
export const getMe = async (req, res) => {
  try {
    const user = await User.findOne({ phoneNumber: req.user.phoneNumber })
    if (!user) return res.status(404).json({ error: 'User not found' })

    res.json({
      phoneNumber: user.phoneNumber,
      firstName: user.firstName,
      lastName: user.lastName,
    })
  } catch (err) {
    console.error('❌ GetMe error:', err.message)
    res.status(500).json({ error: 'Server error' })
  }
}

export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'strict' : 'lax'
  })
  res.json({ message: 'Logout successful' })
}

export const register = async (req, res) => {
  try {
    const { phoneNumber, password, firstName, lastName } = req.body

    if (!phoneNumber || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    if (!/^\+\d{10,15}$/.test(phoneNumber)) {
      return res.status(400).json({ error: 'Invalid phone number format' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    const existingUser = await User.findOne({ phoneNumber })
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }

    const newUser = new User({ phoneNumber, password, firstName, lastName })
    await newUser.save()

    const token = generateToken(newUser)
    res.cookie('token', token, {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'strict' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
})

    res.json({ message: 'Registration successful', token })
  } catch (err) {
    console.error('❌ Registration error:', err.message)
    res.status(500).json({ error: 'Server error during registration' })
  }
}

export const login = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body

    if (!phoneNumber || !password) {
      return res.status(400).json({ error: 'Phone number and password are required' })
    }

    const user = await User.findOne({ phoneNumber })
    if (!user) {
      return res.status(401).json({ error: 'Invalid phone number or password' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid phone number or password' })
    }

    const token = generateToken(user)
    res.cookie('token', token, {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'strict' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
})

    res.json({ message: 'Login successful', token })
  } catch (err) {
    console.error('❌ Login error:', err.message)
    res.status(500).json({ error: 'Server error during login' })
  }
}
