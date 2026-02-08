import mongoose from 'mongoose'
const { Schema } = mongoose

const commentReplySchema = new Schema(
  {
    commentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
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
    },
    image: {
      type: String // URL to uploaded image
    }
  },
  {
    timestamps: true
  }
)

// Index for better query performance
commentReplySchema.index({ commentId: 1, createdAt: -1 })

export default mongoose.model('CommentReply', commentReplySchema)
