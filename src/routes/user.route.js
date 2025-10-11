import express from 'express'

import {
  signupValidation,
  signinValidation
} from '../validations/user.validation.js'

import {
  signup,
  signin,
  getUserList
} from '../controllers/user.controller.js'

import { checkAuth } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post('/signup', signupValidation, signup)
router.post('/signin', signinValidation, signin)
router.get('/list', checkAuth, getUserList)

export default app => {
  app.use('/users', router)
}
