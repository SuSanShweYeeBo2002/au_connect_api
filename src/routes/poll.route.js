import express from 'express'
import { checkAuth } from '../middlewares/auth.middleware.js'
import {
  createPoll,
  getAllPolls,
  getPollById,
  voteOnPoll,
  deletePoll
} from '../controllers/poll.controller.js'
import {
  createPollValidation,
  votePollValidation,
  pollIdValidation,
  paginationValidation
} from '../validations/poll.validation.js'

const router = express.Router()

// Poll routes
router.post('/', checkAuth, createPollValidation, createPoll)
router.get('/', checkAuth, paginationValidation, getAllPolls)
router.get('/:pollId', checkAuth, pollIdValidation, getPollById)
router.post('/:pollId/vote', checkAuth, pollIdValidation, votePollValidation, voteOnPoll)
router.delete('/:pollId', checkAuth, pollIdValidation, deletePoll)

export default app => {
  app.use('/polls', router)
}
