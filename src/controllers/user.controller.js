import {
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
} from '../services/user.service.js'

async function signup (req, res, next) {
  try {
    const { email, password } = req.body

    const user = await signupService({
      email,
      password
    })
    res.status(200).send(user)
  } catch (error) {
    next(error)
  }
}

async function signin (req, res, next) {
  try {
    const { email, password } = req.body

    const user = await signinService({
      email,
      password
    })
    res.status(200).send(user)
  } catch (error) {
    next(error)
  }
}

async function getUserList(req, res, next) {
  try {
    const currentUserId = req.userData.id
    const users = await getUserListService(currentUserId)
    
    res.status(200).send({
      status: 'success',
      message: 'Users retrieved successfully',
      data: users
    })
  } catch (error) {
    next(error)
  }
}

async function getUserById(req, res, next) {
  try {
    const { userId } = req.params
    const user = await getUserByIdService(userId)
    
    res.status(200).send({
      status: 'success',
      message: 'User retrieved successfully',
      data: user
    })
  } catch (error) {
    next(error)
  }
}

async function getCurrentUser(req, res, next) {
  try {
    const userId = req.userData.id
    const user = await getCurrentUserService(userId)
    
    res.status(200).send({
      status: 'success',
      message: 'User profile retrieved successfully',
      data: user
    })
  } catch (error) {
    next(error)
  }
}

async function updateUser(req, res, next) {
  try {
    const userId = req.userData.id
    const updateData = req.body
    
    const user = await updateUserService(userId, updateData)
    
    res.status(200).send({
      status: 'success',
      message: 'User updated successfully',
      data: user
    })
  } catch (error) {
    next(error)
  }
}

async function uploadProfileImage(req, res, next) {
  try {
    const userId = req.userData.id
    
    if (!req.file) {
      const err = new Error()
      err.message = 'No image file provided'
      err.status = 400
      throw err
    }

    const imageUrl = req.file.location // S3 URL
    const user = await uploadProfileImageService(userId, imageUrl)
    
    res.status(200).send({
      status: 'success',
      message: 'Profile image uploaded successfully',
      data: user
    })
  } catch (error) {
    next(error)
  }
}

async function deleteProfileImage(req, res, next) {
  try {
    const userId = req.userData.id
    const user = await deleteProfileImageService(userId)
    
    res.status(200).send({
      status: 'success',
      message: 'Profile image deleted successfully',
      data: user
    })
  } catch (error) {
    next(error)
  }
}

async function verifyEmail(req, res, next) {
  try {
    const { token } = req.query
    
    if (!token) {
      // Redirect to frontend with error
      return res.redirect('https://velvety-gnome-b3b6b3.netlify.app/?verification=error&message=Invalid verification link')
    }

    const result = await verifyEmailService(token)
    
    // Redirect to frontend signin page with success message
    res.redirect('https://velvety-gnome-b3b6b3.netlify.app/?verification=success')
  } catch (error) {
    // Redirect to frontend with error
    const errorMessage = encodeURIComponent(error.message || 'Verification failed')
    res.redirect(`https://velvety-gnome-b3b6b3.netlify.app/?verification=error&message=${errorMessage}`)
  }
}

async function resendVerificationEmail(req, res, next) {
  try {
    const { email } = req.body
    
    if (!email) {
      const err = new Error()
      err.message = 'Email is required'
      err.status = 400
      throw err
    }

    const result = await resendVerificationEmailService(email)
    
    res.status(200).send({
      status: 'success',
      message: result.message
    })
  } catch (error) {
    next(error)
  }
}

export { 
  signup, 
  signin, 
  getUserList, 
  getUserById, 
  getCurrentUser, 
  updateUser,
  uploadProfileImage,
  deleteProfileImage,
  verifyEmail,
  resendVerificationEmail
}
