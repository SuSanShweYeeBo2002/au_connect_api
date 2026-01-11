import mongoose from 'mongoose'
const { Schema } = mongoose

const reportSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reason: {
      type: String,
      required: true,
      maxlength: 500
    }
  },
  {
    timestamps: true
  }
)

// Ensure one user can only report a post once
reportSchema.index({ postId: 1, userId: 1 }, { unique: true })

export default mongoose.model('Report', reportSchema)
