import express from 'express'
import { checkAuth } from '../middlewares/auth.middleware.js'
import {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote
} from '../controllers/note.controller.js'
import {
  createNoteValidation,
  updateNoteValidation,
  noteIdValidation,
  paginationValidation
} from '../validations/note.validation.js'

const router = express.Router()

// Note CRUD routes
router.post('/', checkAuth, createNoteValidation, createNote)
router.get('/', checkAuth, paginationValidation, getAllNotes)
router.get('/:noteId', checkAuth, noteIdValidation, getNoteById)
router.put('/:noteId', checkAuth, noteIdValidation, updateNoteValidation, updateNote)
router.delete('/:noteId', checkAuth, noteIdValidation, deleteNote)

export default app => {
  app.use('/notes', router)
}
