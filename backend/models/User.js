import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
    },
    resetCode: String,
    resetCodeExpires: Date,
    phoneNumber: {
      type: String,
      required: function () {
        return this.loginMethod === 'local'
      },
    },
    password: {
      type: String,
      required: function () {
        return this.loginMethod === 'local'
      },
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    avatar: String,
    googleId: {
      type: String,
      required: function () {
        return this.loginMethod === 'google'
      },
    },
    loginMethod: {
      type: String,
      enum: ['local', 'google'],
      required: true,
    },
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.loginMethod === 'local') {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.model('User', userSchema)
