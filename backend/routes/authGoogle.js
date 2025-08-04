import express from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'

const router = express.Router()
const isProduction = process.env.NODE_ENV === 'production'
const frontendURL = isProduction ? 'https://promtify-aig.com' : 'http://localhost:5173'

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'None',
  domain: isProduction ? '.promtify-aig.com' : undefined,
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
  })
)

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${frontendURL}/?authOpen=login&error=auth_method`,
    session: false,
  }),
  (req, res) => {
    try {
      if (!req.user) {
        return res.redirect(`${frontendURL}/?authOpen=login&error=google_auth`)
      }

      const token = jwt.sign(
        {
          id: req.user._id,
          phoneNumber: req.user.phoneNumber || null,
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )

      res.cookie('token', token, cookieOptions)
      return res.redirect(frontendURL)
    } catch (err) {
      console.error('❌ Google callback error:', err)
      return res.redirect(`${frontendURL}/?authOpen=login&error=server`)
    }
  }
)

router.get('/google/failure', (req, res) => {
  return res.redirect(`${frontendURL}/?authOpen=login&error=auth_method`)
})

export default router
