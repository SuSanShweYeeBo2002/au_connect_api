import mongoose from 'mongoose'
const { Schema } = mongoose

const pollOptionSchema = new Schema({
  text: {
    type: String,
    required: true,
    maxlength: 200
  },
  votes: {
    type: Number,
    default: 0
  },
  voters: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { _id: true })

const pollSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    question: {
      type: String,
      required: true,
      maxlength: 500
    },
    options: {
      type: [pollOptionSchema],
      required: true,
      validate: {
        validator: function(options) {
          return options.length >= 2 && options.length <= 6
        },
        message: 'Poll must have between 2 and 6 options'
      }
    },
    totalVotes: {
      type: Number,
      default: 0
    },
    expiresAt: {
      type: Date,
      default: null
    },
    isExpired: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// Index for better query performance
pollSchema.index({ createdAt: -1 })
pollSchema.index({ author: 1 })
pollSchema.index({ expiresAt: 1 })

// Virtual to check if poll is expired
pollSchema.virtual('expired').get(function() {
  if (!this.expiresAt) return false
  return new Date() > this.expiresAt
})

// Method to check and update expiry status
pollSchema.methods.checkExpiry = function() {
  if (this.expiresAt && new Date() > this.expiresAt && !this.isExpired) {
    this.isExpired = true
    return this.save()
  }
  return Promise.resolve(this)
}

const Poll = mongoose.model('Poll', pollSchema)

export default Poll
