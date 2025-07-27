import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const isProduction = process.env.NODE_ENV === 'production'

const generateToken = (user) => {
  return jwt.sign({ id: user._id, phoneNumber: user.phoneNumber }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })
}
export const getMe = async (req, res) => {
  try {
    if (req.user) {
      return res.json({
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        avatar: req.user.avatar,
        method: 'google',
      })
    }
    const token = req.cookies.token
    if (!token) return res.status(401).json({ error: 'Not authenticated' })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)

    if (!user) return res.status(404).json({ error: 'User not found' })

    res.json({
      email: user.email,
      phoneNumber: user.phoneNumber,
      firstName: user.firstName,
      lastName: user.lastName,
      method: 'jwt',
    })
  } catch (err) {
    console.error('❌ GetMe error:', err.message)
    res.status(500).json({ error: 'Failed to fetch user info' })
  }
}

export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
  })
  res.json({ message: 'Logout successful' })
}

export const register = async (req, res) => {
  try {
    const { phoneNumber, password, firstName, lastName, email } = req.body

    if (!phoneNumber || !password || !firstName || !lastName || !email) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    if (!/^\+\d{10,15}$/.test(phoneNumber)) {
      return res.status(400).json({ error: 'Invalid phone number format' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    const existingUser = await User.findOne({
      $or: [{ phoneNumber }, { email }],
    })

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }

    const newUser = new User({
      phoneNumber,
      password,
      firstName,
      lastName,
      email,
      loginMethod: 'local',
    })
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
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' })
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
