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
        const existingUser = await User.findOne({ email: profile.emails[0].value })

        if (existingUser) return done(null, existingUser)

        const newUser = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          firstName: profile.name.givenName || '',
          lastName: profile.name.familyName || '',
          avatar: profile.photos[0].value,
          loginMethod: 'google',
        })

        return done(null, newUser)
      } catch (err) {
        console.error('❌ Google Auth error:', err)
        return done(err, null)
      }
    }
  )
)
