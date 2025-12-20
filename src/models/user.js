import mongoose from 'mongoose'
const { Schema } = mongoose

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
      type: String,
      required: true
    },
    profileImage: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('User', UserSchema)
