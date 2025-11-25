import mongoose from 'mongoose'
const { Schema } = mongoose

const friendSchema = new Schema(
  {
    requesterId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
      required: true
    }
  },
  {
    timestamps: true
  }
)

// Compound index to prevent duplicate friend requests
friendSchema.index({ requesterId: 1, recipientId: 1 }, { unique: true })
friendSchema.index({ recipientId: 1, status: 1 })
friendSchema.index({ requesterId: 1, status: 1 })

export default mongoose.model('Friend', friendSchema)
