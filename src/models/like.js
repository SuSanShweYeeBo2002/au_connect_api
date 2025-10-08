import mongoose from 'mongoose'
const { Schema } = mongoose

const likeSchema = new Schema(
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
    }
  },
  {
    timestamps: true
  }
)

// Compound index to prevent duplicate likes and optimize queries
likeSchema.index({ postId: 1, userId: 1 }, { unique: true })
likeSchema.index({ postId: 1, createdAt: -1 })
likeSchema.index({ userId: 1, createdAt: -1 })

export default mongoose.model('Like', likeSchema)