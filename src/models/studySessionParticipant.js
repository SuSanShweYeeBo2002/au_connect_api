import mongoose from 'mongoose'
const { Schema } = mongoose

const studySessionParticipantSchema = new Schema(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: 'StudySession',
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Joined', 'Left', 'Removed'],
      default: 'Joined'
    }
  },
  {
    timestamps: true
  }
)

// Compound index to ensure a user can only join a session once (as active participant)
studySessionParticipantSchema.index({ sessionId: 1, userId: 1, status: 1 })
studySessionParticipantSchema.index({ sessionId: 1, status: 1 })
studySessionParticipantSchema.index({ userId: 1, status: 1 })

export default mongoose.model('StudySessionParticipant', studySessionParticipantSchema)
