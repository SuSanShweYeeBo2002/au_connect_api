import mongoose from 'mongoose'
const { Schema } = mongoose

const noteSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true,
      maxlength: 200
    },
    content: {
      type: String,
      required: true,
      maxlength: 5000
    }
  },
  {
    timestamps: true
  }
)

// Index for better query performance
noteSchema.index({ createdAt: -1 })
noteSchema.index({ author: 1 })

export default mongoose.model('Note', noteSchema)
