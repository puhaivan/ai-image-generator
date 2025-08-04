import express from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'

const router = express.Router()
const isProduction = process.env.NODE_ENV === 'production'
const frontendURL = isProduction ? 'https://promtify-aig.com' : 'http://localhost:5173'

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
    failureRedirect: '/auth/google/failure',
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })

    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'None',
      domain: isProduction ? '.promtify-aig.com' : undefined,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.redirect(frontendURL)
  }
)

router.get('/google/failure', (req, res) => {
  res.redirect(`${frontendURL}/?authOpen=login&error=auth_method`)
})

export default router
