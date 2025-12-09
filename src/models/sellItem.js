import mongoose from 'mongoose'
const { Schema } = mongoose

const sellItemSchema = new Schema(
  {
    seller: {
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
    price: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      required: true,
      enum: ['Electronics', 'Books', 'Clothing', 'Furniture', 'Sports', 'Other']
    },
    condition: {
      type: String,
      required: true,
      enum: ['New', 'Like New', 'Good', 'Fair', 'Poor']
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
      enum: ['Available', 'Sold', 'Reserved'],
      default: 'Available'
    }
  },
  {
    timestamps: true
  }
)

// Index for better query performance
sellItemSchema.index({ createdAt: -1 })
sellItemSchema.index({ seller: 1 })
sellItemSchema.index({ category: 1 })
sellItemSchema.index({ status: 1 })

export default mongoose.model('SellItem', sellItemSchema)
