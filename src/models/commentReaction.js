import mongoose from 'mongoose'
const { Schema } = mongoose

const commentReactionSchema = new Schema(
  {
    commentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reactionType: {
      type: String,
      enum: ['like', 'love', 'haha', 'wow', 'sad', 'angry'],
      required: true,
      default: 'like'
    }
  },
  {
    timestamps: true
  }
)

// Compound index to ensure one reaction per user per comment
commentReactionSchema.index({ commentId: 1, user: 1 }, { unique: true })
commentReactionSchema.index({ commentId: 1, reactionType: 1 })

export default mongoose.model('CommentReaction', commentReactionSchema)
