import express from 'express'
import { checkAuth } from '../middlewares/auth.middleware.js'
import {
  createStudySession,
  getAllStudySessions,
  getStudySessionById,
  updateStudySession,
  deleteStudySession,
  joinStudySession,
  leaveStudySession,
  getStudySessionParticipants
} from '../controllers/studySession.controller.js'
import {
  createStudySessionValidation,
  updateStudySessionValidation,
  studySessionIdValidation,
  paginationValidation
} from '../validations/studySession.validation.js'

const router = express.Router()

// Study Session CRUD routes
router.post('/', checkAuth, createStudySessionValidation, createStudySession)
router.get('/', checkAuth, paginationValidation, getAllStudySessions)
router.get('/:sessionId', checkAuth, studySessionIdValidation, getStudySessionById)
router.put('/:sessionId', checkAuth, studySessionIdValidation, updateStudySessionValidation, updateStudySession)
router.delete('/:sessionId', checkAuth, studySessionIdValidation, deleteStudySession)

// Join/Leave routes
router.post('/:sessionId/join', checkAuth, studySessionIdValidation, joinStudySession)
router.post('/:sessionId/leave', checkAuth, studySessionIdValidation, leaveStudySession)

// Get participants
router.get('/:sessionId/participants', checkAuth, studySessionIdValidation, getStudySessionParticipants)

export default app => {
  app.use('/study-sessions', router)
}
