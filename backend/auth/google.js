import dotenv from 'dotenv'
dotenv.config()

import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import User from '../models/User.js'

const isProduction = process.env.NODE_ENV === 'production'

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: isProduction
        ? 'https://api.promtify-aig.com/auth/google/callback'
        : 'http://localhost:3001/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value
        if (!email) return done(null, false, { message: 'Email not available from Google' })

        let user = await User.findOne({ googleId: profile.id })

        if (!user) {
          user = await User.findOne({ email })
        }

        if (user && !user.googleId) {
          user.googleId = profile.id
          await user.save()
        }

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            email,
            firstName: profile.name?.givenName || '',
            lastName: profile.name?.familyName || '',
            avatar: profile.photos?.[0]?.value || '',
            loginMethod: 'google',
            isVerified: true,
          })
        }

        return done(null, user)
      } catch (err) {
        console.error('❌ Google Auth error:', err)
        return done(err, null)
      }
    }
  )
)
