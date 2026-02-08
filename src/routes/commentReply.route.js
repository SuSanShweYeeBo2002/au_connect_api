import express from 'express'
import { checkAuth } from '../middlewares/auth.middleware.js'
import {
  addReply,
  getRepliesByComment,
  updateReply,
  deleteReply
} from '../controllers/commentReply.controller.js'

const router = express.Router()

// Add a reply to a comment
router.post('/:commentId/replies', checkAuth, addReply)

// Get all replies for a comment
router.get('/:commentId/replies', getRepliesByComment)

// Update a reply
router.put('/replies/:replyId', checkAuth, updateReply)

// Delete a reply
router.delete('/replies/:replyId', checkAuth, deleteReply)

export default app => {
  app.use('/comments', router)
}
