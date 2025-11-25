import express from 'express'

import {
  sendFriendRequestValidation,
  respondFriendRequestValidation,
  unfriendValidation
} from '../validations/friend.validation.js'

import {
  sendFriendRequest,
  getPendingRequests,
  getSentRequests,
  respondFriendRequest,
  getFriendsList,
  unfriend,
  cancelFriendRequest
} from '../controllers/friend.controller.js'

import { checkAuth } from '../middlewares/auth.middleware.js'

const router = express.Router()

// Send friend request
router.post('/request', checkAuth, sendFriendRequestValidation, sendFriendRequest)

// Get pending friend requests (received)
router.get('/requests/pending', checkAuth, getPendingRequests)

// Get sent friend requests
router.get('/requests/sent', checkAuth, getSentRequests)

// Accept or reject friend request
router.put('/request/:requestId', checkAuth, respondFriendRequestValidation, respondFriendRequest)

// Cancel sent friend request
router.delete('/request/:requestId', checkAuth, cancelFriendRequest)

// Get friends list
router.get('/list', checkAuth, getFriendsList)

// Unfriend
router.delete('/:friendId', checkAuth, unfriendValidation, unfriend)

export default app => {
  app.use('/friends', router)
}
