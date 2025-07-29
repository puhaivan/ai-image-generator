import dotenv from 'dotenv'
dotenv.config()

import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import User from '../models/User.js'

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value
        const existingUser = await User.findOne({ email })

        if (existingUser) {
          if (existingUser.loginMethod !== 'google') {
            return done(null, false, { message: 'auth_method' })
          }

          return done(null, existingUser)
        }

        const newUser = await User.create({
          googleId: profile.id,
          email,
          firstName: profile.name?.givenName || '',
          lastName: profile.name?.familyName || '',
          avatar: profile.photos?.[0]?.value || '',
          loginMethod: 'google',
          isVerified: true,
        })

        return done(null, newUser)
      } catch (err) {
        console.error('❌ Google Auth error:', err)
        return done(err, null)
      }
    }
  )
)
