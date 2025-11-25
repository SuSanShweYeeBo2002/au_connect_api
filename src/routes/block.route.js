import express from 'express'

import {
  blockUserValidation,
  unblockUserValidation
} from '../validations/block.validation.js'

import {
  blockUser,
  unblockUser,
  getBlockedUsers,
  getWhoBlockedMe
} from '../controllers/block.controller.js'

import { checkAuth } from '../middlewares/auth.middleware.js'

const router = express.Router()

// Block a user
router.post('/', checkAuth, blockUserValidation, blockUser)

// Unblock a user
router.delete('/:blockedId', checkAuth, unblockUserValidation, unblockUser)

// Get blocked users list
router.get('/list', checkAuth, getBlockedUsers)

// Get users who blocked me
router.get('/who-blocked-me', checkAuth, getWhoBlockedMe)

export default app => {
  app.use('/blocks', router)
}
