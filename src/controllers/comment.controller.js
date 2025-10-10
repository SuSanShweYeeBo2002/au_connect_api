import {
  addComment as addCommentService,
  getCommentsByPost as getCommentsByPostService,
  updateComment as updateCommentService,
  deleteComment as deleteCommentService
} from '../services/comment.service.js'

async function addComment(req, res, next) {
  try {
    const { postId } = req.params
    const { content, image } = req.body
    const authorId = req.userData.id

    const comment = await addCommentService(postId, authorId, content, image)
    res.status(201).send({
      status: 'success',
      message: 'Comment added successfully',
      data: comment
    })
  } catch (error) {
    next(error)
  }
}

async function getCommentsByPost(req, res, next) {
  try {
    const { postId } = req.params
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    const result = await getCommentsByPostService(postId, page, limit)
    res.status(200).send({
      status: 'success',
      message: 'Comments retrieved successfully',
      data: result.comments,
      pagination: result.pagination
    })
  } catch (error) {
    next(error)
  }
}

async function updateComment(req, res, next) {
  try {
    const { commentId } = req.params
    const { content, image } = req.body
    const authorId = req.userData.id

    const comment = await updateCommentService(commentId, authorId, content, image)
    res.status(200).send({
      status: 'success',
      message: 'Comment updated successfully',
      data: comment
    })
  } catch (error) {
    next(error)
  }
}

async function deleteComment(req, res, next) {
  try {
    const { commentId } = req.params
    const userId = req.userData.id

    const result = await deleteCommentService(commentId, userId)
    res.status(200).send({
      status: 'success',
      message: result.message
    })
  } catch (error) {
    next(error)
  }
}

export {
  addComment,
  getCommentsByPost,
  updateComment,
  deleteComment
}