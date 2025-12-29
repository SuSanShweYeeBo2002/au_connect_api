import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from '../models/user.js'
import { deleteFromS3 } from '../utils/s3.js'
import { sendVerificationEmail, validateEmailDomain, generateVerificationToken } from '../utils/email.js'

async function signupService ({ email, password }) {
  try {
    // Validate email domain
    if (!validateEmailDomain(email)) {
      const err = new Error()
      err.message = 'Email domain not allowed. Please use your university email address.'
      err.status = 400
      throw err
    }

    // check if email already exists
    const user = await User.findOne({ email })
    if (user) {
      const err = new Error()
      err.message = 'Email already exists.'
      err.status = 400
      throw err
    }

    const hash = await bcrypt.hash(password, 10)

    // Generate verification token
    const verificationToken = generateVerificationToken()
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // create User
    await new User({
      email,
      password: hash,
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires
    }).save()

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationToken)
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
      // Don't fail signup if email fails - user can request resend
    }

    return { 
      message: 'User was created successfully. Please check your email to verify your account.' 
    }
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

    // Check if email is verified
    if (!user.isEmailVerified) {
      const err = new Error()
      err.message = 'Please verify your email address before signing in. Check your email for the verification link.'
      err.status = 403
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

async function verifyEmailService(token) {
  try {
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    })

    if (!user) {
      const err = new Error()
      err.message = 'Invalid or expired verification token.'
      err.status = 400
      throw err
    }

    user.isEmailVerified = true
    user.emailVerificationToken = null
    user.emailVerificationExpires = null
    await user.save()

    return { message: 'Email verified successfully. You can now sign in.' }
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function resendVerificationEmailService(email) {
  try {
    const user = await User.findOne({ email })

    if (!user) {
      const err = new Error()
      err.message = 'Email not found.'
      err.status = 404
      throw err
    }

    if (user.isEmailVerified) {
      const err = new Error()
      err.message = 'Email is already verified.'
      err.status = 400
      throw err
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken()
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    user.emailVerificationToken = verificationToken
    user.emailVerificationExpires = verificationExpires
    await user.save()

    // Send verification email
    await sendVerificationEmail(email, verificationToken)

    return { message: 'Verification email sent. Please check your inbox.' }
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
  deleteProfileImageService,
  verifyEmailService,
  resendVerificationEmailService
}
