import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    url: { type: String, required: true },
    prompt: { type: String, required: true },
  },
  { timestamps: true }
)

const Image = mongoose.model('Image', imageSchema)

export default Image
