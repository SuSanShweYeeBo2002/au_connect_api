import mongoose from 'mongoose'
const { Schema } = mongoose

const lostItemSchema = new Schema(
  {
    reporter: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true,
      maxlength: 200
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000
    },
    category: {
      type: String,
      required: true,
      enum: ['Electronics', 'Documents', 'Keys', 'Bags', 'Clothing', 'Jewelry', 'Books', 'Other']
    },
    type: {
      type: String,
      required: true,
      enum: ['Lost', 'Found']
    },
    location: {
      type: String,
      required: true,
      maxlength: 300
    },
    dateReported: {
      type: Date,
      required: true,
      default: Date.now
    },
    images: [{
      type: String // URLs to uploaded images
    }],
    contactInfo: {
      phone: String,
      email: String
    },
    status: {
      type: String,
      enum: ['Active', 'Resolved', 'Closed'],
      default: 'Active'
    }
  },
  {
    timestamps: true
  }
)

// Index for better query performance
lostItemSchema.index({ createdAt: -1 })
lostItemSchema.index({ reporter: 1 })
lostItemSchema.index({ category: 1 })
lostItemSchema.index({ type: 1 })
lostItemSchema.index({ status: 1 })

export default mongoose.model('LostItem', lostItemSchema)
