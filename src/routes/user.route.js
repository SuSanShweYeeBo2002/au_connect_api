import express from 'express'

import {
  signupValidation,
  signinValidation,
  updateUserValidation,
  userIdValidation
} from '../validations/user.validation.js'

import {
  signup,
  signin,
  getUserList,
  getUserById,
  getCurrentUser,
  updateUser,
  uploadProfileImage,
  deleteProfileImage
} from '../controllers/user.controller.js'

import { checkAuth } from '../middlewares/auth.middleware.js'
import { uploadToS3 } from '../utils/s3.js'

const router = express.Router()

router.post('/signup', signupValidation, signup)
router.post('/signin', signinValidation, signin)
router.get('/list', checkAuth, getUserList)
router.get('/me', checkAuth, getCurrentUser)
router.put('/me', checkAuth, updateUserValidation, updateUser)
router.post('/me/profile-image', checkAuth, uploadToS3.single('profileImage'), uploadProfileImage)
router.delete('/me/profile-image', checkAuth, deleteProfileImage)
router.get('/:userId', checkAuth, userIdValidation, getUserById)

export default app => {
  app.use('/users', router)
}
