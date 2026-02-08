import express from 'express'
import { checkAuth } from '../middlewares/auth.middleware.js'
import {
  addOrUpdateReaction,
  removeReaction,
  getReactionsByComment,
  getUserReaction
} from '../controllers/commentReaction.controller.js'

const router = express.Router()

// Get user's reaction for a comment (must be before /:commentId/reactions)
router.get('/:commentId/reactions/me', checkAuth, getUserReaction)

// Add or update a reaction to a comment
router.post('/:commentId/reactions', checkAuth, addOrUpdateReaction)

// Remove a reaction from a comment
router.delete('/:commentId/reactions', checkAuth, removeReaction)

// Get all reactions for a comment
router.get('/:commentId/reactions', getReactionsByComment)

export default app => {
  app.use('/comments', router)
}
