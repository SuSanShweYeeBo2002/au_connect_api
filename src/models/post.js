import mongoose from 'mongoose'
const { Schema } = mongoose

const postSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000
    },
    image: {
      type: String // URL to uploaded image
    },
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    commentCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// Virtual to populate comments if needed
postSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'postId'
})

// Index for better query performance
postSchema.index({ createdAt: -1 })
postSchema.index({ author: 1 })

export default mongoose.model('Post', postSchema)