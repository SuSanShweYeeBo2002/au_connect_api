import mongoose from 'mongoose'
const { Schema } = mongoose

const sponsorAdSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 100
    },
    sponsorName: {
      type: String,
      required: true,
      maxlength: 100
    },
    image: {
      type: String, // URL to uploaded image
      required: true
    },
    link: {
      type: String,
      required: true,
      maxlength: 500
    },
    description: {
      type: String,
      maxlength: 500
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'paused', 'expired'],
      default: 'pending'
    },
    clickCount: {
      type: Number,
      default: 0
    },
    impressionCount: {
      type: Number,
      default: 0
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
)

// Index for faster queries on active ads
sponsorAdSchema.index({ status: 1, startDate: 1, endDate: 1 })

export default mongoose.model('SponsorAd', sponsorAdSchema)
