import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import crypto from 'crypto'
import sendEmail from '../utils/sendEmail.js'

const isProduction = process.env.NODE_ENV === 'production'

const generateToken = (user) => {
  return jwt.sign({ id: user._id, phoneNumber: user.phoneNumber }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })
}

export const getMe = async (req, res) => {
  try {
    if (req.user) {
      if (!req.user.isVerified) {
        return res.status(403).json({
          error: 'Email not verified',
          requiresVerification: true,
          email: req.user.email,
        })
      }

      return res.json({
        email: req.user.email,
        phoneNumber: req.user.phoneNumber,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        avatar: req.user.avatar,
        method: req.user.loginMethod,
      })
    }

    const token = req.cookies.token
    if (!token) {
      return res.status(401).end()
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (!user.isVerified) {
      return res.status(403).json({
        error: 'Email not verified',
        requiresVerification: true,
        email: user.email,
      })
    }

    return res.json({
      email: user.email,
      phoneNumber: user.phoneNumber,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      method: user.loginMethod,
    })
  } catch (err) {
    console.error('❌ GetMe error:', err.message)
    res.status(500).json({ error: 'Failed to fetch user info' })
  }
}

export const logout = (req, res) => {
  try {
    const finish = () => {
      res.clearCookie('token', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'None' : 'Lax',
      })
      res.clearCookie('connect.sid')
      res.status(200).json({ message: 'Logout successful' })
    }

    if (typeof req.logout === 'function') {
      req.logout((err) => {
        if (err) {
          console.error('Logout error:', err)
          return res.status(500).json({ message: 'Logout failed' })
        }

        if (req.session) {
          req.session.destroy((err) => {
            if (err) console.error('Session destroy error:', err)
            finish()
          })
        } else {
          finish()
        }
      })
    } else {
      finish()
    }
  } catch (err) {
    console.error('❌ Logout unexpected error:', err)
    res.status(500).json({ message: 'Unexpected logout error' })
  }
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

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      const method = existingUser.loginMethod

      const error =
        method === 'google'
          ? 'This email is already registered via Google. Please log in with Google.'
          : 'Email is already registered. Please log in.'

      return res.status(400).json({ error })
    }
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    const newUser = new User({
      phoneNumber,
      password,
      firstName,
      lastName,
      email,
      loginMethod: 'local',
      isVerified: false,
      verificationCode,
    })

    await newUser.save()
    await sendEmail(
      email,
      'Verify your email',
      `Hello ${firstName}, your verification code is: ${verificationCode}`
    )

    const token = generateToken(newUser)
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'None' : 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.json({ message: 'Registration successful', token })
  } catch (err) {
    console.error('❌ Registration error:', err.message)

    if (err.code === 11000) {
      const duplicateField = Object.keys(err.keyValue)[0]
      const duplicateValue = err.keyValue[duplicateField]
      return res.status(400).json({
        error:
          duplicateField === 'email'
            ? 'This email is already registered'
            : duplicateField === 'phoneNumber'
              ? 'This phone number is already registered'
              : `Duplicate value: ${duplicateValue}`,
      })
    }

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

    if (user.loginMethod === 'google') {
      return res.status(400).json({
        error: 'This email is registered via Google. Please use Google login.',
      })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    if (!user.isVerified) {
      return res.status(200).json({
        requiresVerification: true,
        email: user.email,
        message: 'Please verify your email',
      })
    }

    const token = generateToken(user)
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'None' : 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.json({ message: 'Login successful', token })
  } catch (err) {
    console.error('❌ Login error:', err.message)
    res.status(500).json({ error: 'Server error during login' })
  }
}

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = req.user

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Both current and new passwords are required' })
    }

    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' })
    }

    user.password = newPassword
    await user.save()

    res.json({ message: 'Password changed successfully' })
  } catch (err) {
    console.error('❌ Change password error:', err)
    res.status(500).json({ error: 'Server error during password change' })
  }
}

export const verifyEmail = async (req, res) => {
  const { email, code } = req.body

  const user = await User.findOne({ email })
  if (!user) return res.status(404).json({ error: 'User not found' })

  if (user.isVerified) return res.status(400).json({ error: 'User already verified' })

  if (user.verificationCode !== code) {
    return res.status(400).json({ error: 'Invalid verification code' })
  }

  user.isVerified = true
  user.verificationCode = undefined
  await user.save()

  const token = generateToken(user)
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'None' : 'Lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })

  res.json({ message: 'Email verified successfully', token })
}

export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })

    if (!user) return res.status(404).json({ error: 'User not found' })
    if (user.isVerified) return res.status(400).json({ error: 'User already verified' })

    user.verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    await user.save()

    await sendEmail(
      email,
      'Verify your email',
      `Hello ${user.firstName}, your new verification code is: ${user.verificationCode}`
    )

    res.json({ message: 'Verification code resent successfully' })
  } catch (err) {
    console.error('❌ Resend verification error:', err.message)
    res.status(500).json({ error: 'Server error while resending verification code' })
  }
}

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })

    if (!user) return res.status(404).json({ error: 'No user with that email found' })
    if (user.loginMethod === 'google') {
      return res.status(400).json({ error: 'Google users cannot change password' })
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    user.resetCode = code
    user.resetCodeExpires = Date.now() + 15 * 60 * 1000
    await user.save()

    await sendEmail(user.email, 'Reset Your Password', `Your code is: ${code}`)

    res.json({ message: 'Reset code sent to your email' })
  } catch (err) {
    console.error('❌ Forgot Password error:', err.message)
    res.status(500).json({ error: 'Server error during forgot password' })
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ error: 'User not found' })

    if (user.resetCode !== code || !user.resetCodeExpires || user.resetCodeExpires < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired reset code' })
    }

    user.password = newPassword
    user.resetCode = undefined
    user.resetCodeExpires = undefined
    await user.save()

    res.json({ message: 'Password has been reset successfully' })
  } catch (err) {
    console.error('❌ Reset Password error:', err.message)
    res.status(500).json({ error: 'Server error during password reset' })
  }
}
