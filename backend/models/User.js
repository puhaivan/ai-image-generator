import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
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
  firstName: String,
  lastName: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: String,
  googleId: String,
  loginMethod: {
    type: String,
    enum: ['local', 'google'],
    required: true,
  },
})
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
