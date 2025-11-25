import {
  createNote as createNoteService,
  getAllNotes as getAllNotesService,
  getNoteById as getNoteByIdService,
  updateNote as updateNoteService,
  deleteNote as deleteNoteService
} from '../services/note.service.js'

async function createNote(req, res, next) {
  try {
    const { title, content } = req.body
    const authorId = req.userData.id

    const note = await createNoteService(authorId, title, content)
    res.status(201).send({
      status: 'success',
      message: 'Note created successfully',
      data: note
    })
  } catch (error) {
    next(error)
  }
}

async function getAllNotes(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const userId = req.userData.id

    const result = await getAllNotesService(page, limit, userId)
    res.status(200).send({
      status: 'success',
      message: 'Notes retrieved successfully',
      data: result.notes,
      pagination: result.pagination
    })
  } catch (error) {
    next(error)
  }
}

async function getNoteById(req, res, next) {
  try {
    const { noteId } = req.params
    const userId = req.userData.id

    const note = await getNoteByIdService(noteId, userId)
    res.status(200).send({
      status: 'success',
      message: 'Note retrieved successfully',
      data: note
    })
  } catch (error) {
    next(error)
  }
}

async function updateNote(req, res, next) {
  try {
    const { noteId } = req.params
    const { title, content } = req.body
    const authorId = req.userData.id

    const note = await updateNoteService(noteId, authorId, title, content)
    res.status(200).send({
      status: 'success',
      message: 'Note updated successfully',
      data: note
    })
  } catch (error) {
    next(error)
  }
}

async function deleteNote(req, res, next) {
  try {
    const { noteId } = req.params
    const authorId = req.userData.id

    const result = await deleteNoteService(noteId, authorId)
    res.status(200).send({
      status: 'success',
      message: result.message
    })
  } catch (error) {
    next(error)
  }
}

export {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote
}
