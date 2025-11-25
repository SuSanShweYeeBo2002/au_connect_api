import mongoose from 'mongoose'
const { Schema } = mongoose

const blockSchema = new Schema(
  {
    blockerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    blockedId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
)

// Compound index to prevent duplicate blocks and optimize queries
blockSchema.index({ blockerId: 1, blockedId: 1 }, { unique: true })
blockSchema.index({ blockedId: 1 })
blockSchema.index({ blockerId: 1 })

export default mongoose.model('Block', blockSchema)
