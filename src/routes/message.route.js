import express from 'express'
import { checkAuth } from '../middlewares/auth.middleware.js'
import {
  sendMessage,
  getConversation,
  getUserConversations,
  markAsRead
} from '../controllers/message.controller.js'

const router = express.Router()

router.post('/send', checkAuth, sendMessage)
router.get('/conversation/:userId', checkAuth, getConversation)
router.get('/conversations', checkAuth, getUserConversations)
router.put('/read/:conversationId', checkAuth, markAsRead)

export default app => {
  app.use('/messages', router)
}