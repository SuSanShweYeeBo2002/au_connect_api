import {
  addReply as addReplyService,
  getRepliesByComment as getRepliesByCommentService,
  updateReply as updateReplyService,
  deleteReply as deleteReplyService
} from '../services/commentReply.service.js'

async function addReply(req, res, next) {
  try {
    const { commentId } = req.params
    const { content } = req.body
    const authorId = req.userData.id
    const image = req.file ? req.file.location : null

    const reply = await addReplyService(commentId, authorId, content, image)
    res.status(201).send({
      status: 'success',
      message: 'Reply added successfully',
      data: reply
    })
  } catch (error) {
    next(error)
  }
}

async function getRepliesByComment(req, res, next) {
  try {
    const { commentId } = req.params
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    const result = await getRepliesByCommentService(commentId, page, limit)
    res.status(200).send({
      status: 'success',
      message: 'Replies retrieved successfully',
      data: result.replies,
      pagination: result.pagination
    })
  } catch (error) {
    next(error)
  }
}

async function updateReply(req, res, next) {
  try {
    const { replyId } = req.params
    const { content } = req.body
    const authorId = req.userData.id
    const image = req.file ? req.file.location : undefined

    const reply = await updateReplyService(replyId, authorId, content, image)
    res.status(200).send({
      status: 'success',
      message: 'Reply updated successfully',
      data: reply
    })
  } catch (error) {
    next(error)
  }
}

async function deleteReply(req, res, next) {
  try {
    const { replyId } = req.params
    const userId = req.userData.id

    const result = await deleteReplyService(replyId, userId)
    res.status(200).send({
      status: 'success',
      message: result.message
    })
  } catch (error) {
    next(error)
  }
}

export {
  addReply,
  getRepliesByComment,
  updateReply,
  deleteReply
}
