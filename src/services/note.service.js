import Note from '../models/note.js'

async function createNote(authorId, title, content) {
  try {
    const note = await new Note({
      author: authorId,
      title,
      content
    }).save()
    
    return note.populate('author', 'email')
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status
    throw err
  }
}

async function getAllNotes(page = 1, limit = 10, userId) {
  try {
    const skip = (page - 1) * limit
    
    // Only get notes for the authenticated user
    const notes = await Note.find({ author: userId })
      .populate('author', 'email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
    
    const totalNotes = await Note.countDocuments({ author: userId })
    
    return {
      notes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalNotes / limit),
        totalNotes,
        hasNext: page < Math.ceil(totalNotes / limit),
        hasPrev: page > 1
      }
    }
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status
    throw err
  }
}

async function getNoteById(noteId, userId) {
  try {
    const note = await Note.findOne({ _id: noteId, author: userId })
      .populate('author', 'email')
    
    if (!note) {
      const err = new Error()
      err.message = 'Note not found or unauthorized'
      err.status = 404
      throw err
    }
    
    return note
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function updateNote(noteId, authorId, title, content) {
  try {
    const note = await Note.findOne({ _id: noteId, author: authorId })
    
    if (!note) {
      const err = new Error()
      err.message = 'Note not found or unauthorized'
      err.status = 404
      throw err
    }
    
    note.title = title
    note.content = content
    
    await note.save()
    return note.populate('author', 'email')
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function deleteNote(noteId, authorId) {
  try {
    const note = await Note.findOneAndDelete({ _id: noteId, author: authorId })
    
    if (!note) {
      const err = new Error()
      err.message = 'Note not found or unauthorized'
      err.status = 404
      throw err
    }
    
    return { message: 'Note deleted successfully' }
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

export {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote
}
