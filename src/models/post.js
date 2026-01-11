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
    images: [{
      type: String // URLs to uploaded images
    }],
    likeCount: {
      type: Number,
      default: 0
    },
    commentCount: {
      type: Number,
      default: 0
    },
    reportCount: {
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

// Virtual to populate likes if needed
postSchema.virtual('likes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'postId'
})

// Index for better query performance
postSchema.index({ createdAt: -1 })
postSchema.index({ author: 1 })

export default mongoose.model('Post', postSchema)