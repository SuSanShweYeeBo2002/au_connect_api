import mongoose from 'mongoose'
const { Schema } = mongoose

const commentSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 500
    }
  },
  {
    timestamps: true
  }
)

// Index for better query performance
commentSchema.index({ postId: 1, createdAt: -1 })

export default mongoose.model('Comment', commentSchema)