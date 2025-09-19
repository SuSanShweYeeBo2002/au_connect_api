import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from '../models/user'

async function signupService ({ email, password }) {
  try {
    // check if email already exists
    const user = await User.findOne({ email })
    if (user) {
      const err = new Error()
      err.message = 'Email already exists.'
      err.status = 400
      throw err
    }

    const hash = await bcrypt.hash(password, 10)

    // create User
    await new User({
      email,
      password: hash
    }).save()

    return { message: 'User was created successfully.' }
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status
    throw err
  }
}

async function signinService ({ email, password }) {
  try {
    // get User
    const user = await User.findOne({ email })
    if (!user) {
      const err = new Error()
      err.message = 'Email not found.'
      err.status = 404
      throw err
    }

    const result = await bcrypt.compare(password, user.password)
    if (!result) {
      const err = new Error()
      err.message = 'Password mismatch.'
      err.status = 400
      throw err
    }

    const token = await jwt.sign(
      { 
        id: user._id,
        email: user.email
      }, 
      'secret', 
      {
        expiresIn: '24h'
      }
    )

    return { token }
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status
    throw err
  }
}

async function getUserListService(currentUserId) {
  try {
    // Get all users except the current user
    const users = await User.find(
      { _id: { $ne: currentUserId } },
      { email: 1 } // Only return _id and email fields
    ).sort({ email: 1 })

    return users
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status
    throw err
  }
}

export {
  signupService,
  signinService,
  getUserListService
}
