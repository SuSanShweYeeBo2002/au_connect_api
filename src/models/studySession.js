import mongoose from 'mongoose'
const { Schema } = mongoose

const studySessionSchema = new Schema(
  {
    creator: {
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
      maxlength: 1000
    },
    subject: {
      type: String,
      required: true,
      maxlength: 100
    },
    platform: {
      type: String,
      required: true,
      enum: ['Zoom', 'Google Meet', 'Microsoft Teams', 'Discord', 'Other'],
      default: 'Other'
    },
    platformLink: {
      type: String,
      maxlength: 500
    },
    studyType: {
      type: String,
      required: true,
      enum: ['Online', 'Offline', 'Hybrid'],
      default: 'Online'
    },
    location: {
      type: String,
      maxlength: 300
    },
    maxParticipants: {
      type: Number,
      default: null, // null means unlimited
      min: 2
    },
    currentParticipants: {
      type: Number,
      default: 1 // Creator is counted as first participant
    },
    scheduledDate: {
      type: Date,
      required: true
    },
    duration: {
      type: Number, // Duration in minutes
      required: true,
      min: 15
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Ongoing', 'Completed', 'Cancelled'],
      default: 'Scheduled'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// Virtual to check if session is full
studySessionSchema.virtual('isFull').get(function() {
  if (!this.maxParticipants) return false // Unlimited
  return this.currentParticipants >= this.maxParticipants
})

// Index for better query performance
studySessionSchema.index({ createdAt: -1 })
studySessionSchema.index({ creator: 1 })
studySessionSchema.index({ scheduledDate: 1 })
studySessionSchema.index({ status: 1 })
studySessionSchema.index({ studyType: 1 })

export default mongoose.model('StudySession', studySessionSchema)
