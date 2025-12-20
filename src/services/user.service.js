import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from '../models/user.js'
import { deleteFromS3 } from '../utils/s3.js'

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

    return { 
      token,
      userId: user._id,
      email: user.email
    }
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

async function getUserByIdService(userId) {
  try {
    const user = await User.findById(userId, { password: 0 })
    
    if (!user) {
      const err = new Error()
      err.message = 'User not found'
      err.status = 404
      throw err
    }
    
    return user
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function getCurrentUserService(userId) {
  try {
    const user = await User.findById(userId, { password: 0 })
    
    if (!user) {
      const err = new Error()
      err.message = 'User not found'
      err.status = 404
      throw err
    }
    
    return user
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function updateUserService(userId, updateData) {
  try {
    const user = await User.findById(userId)
    
    if (!user) {
      const err = new Error()
      err.message = 'User not found'
      err.status = 404
      throw err
    }
    
    // If password is being updated, hash it
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10)
    }
    
    // Update user fields
    Object.assign(user, updateData)
    await user.save()
    
    // Return user without password
    const updatedUser = await User.findById(userId, { password: 0 })
    return updatedUser
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function uploadProfileImageService(userId, imageUrl) {
  try {
    const user = await User.findById(userId)
    
    if (!user) {
      const err = new Error()
      err.message = 'User not found'
      err.status = 404
      throw err
    }
    
    // Delete old profile image from S3 if exists
    if (user.profileImage) {
      try {
        await deleteFromS3(user.profileImage)
      } catch (error) {
        console.error('Error deleting old profile image:', error)
      }
    }
    
    // Update user with new profile image URL
    user.profileImage = imageUrl
    await user.save()
    
    // Return user without password
    const updatedUser = await User.findById(userId, { password: 0 })
    return updatedUser
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function deleteProfileImageService(userId) {
  try {
    const user = await User.findById(userId)
    
    if (!user) {
      const err = new Error()
      err.message = 'User not found'
      err.status = 404
      throw err
    }
    
    if (!user.profileImage) {
      const err = new Error()
      err.message = 'No profile image to delete'
      err.status = 400
      throw err
    }
    
    // Delete profile image from S3
    await deleteFromS3(user.profileImage)
    
    // Remove profile image URL from user
    user.profileImage = null
    await user.save()
    
    // Return user without password
    const updatedUser = await User.findById(userId, { password: 0 })
    return updatedUser
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

export {
  signupService,
  signinService,
  getUserListService,
  getUserByIdService,
  getCurrentUserService,
  updateUserService,
  uploadProfileImageService,
  deleteProfileImageService
}
