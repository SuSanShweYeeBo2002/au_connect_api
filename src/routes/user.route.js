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
  updateUser
} from '../controllers/user.controller.js'

import { checkAuth } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post('/signup', signupValidation, signup)
router.post('/signin', signinValidation, signin)
router.get('/list', checkAuth, getUserList)
router.get('/me', checkAuth, getCurrentUser)
router.put('/me', checkAuth, updateUserValidation, updateUser)
router.get('/:userId', checkAuth, userIdValidation, getUserById)

export default app => {
  app.use('/users', router)
}
