import express from 'express'
import { checkAuth } from '../middlewares/auth.middleware.js'
import {
  addComment,
  getCommentsByPost,
  updateComment,
  deleteComment
} from '../controllers/comment.controller.js'
import {
  addCommentValidation,
  updateCommentValidation,
  commentIdValidation,
  postIdValidation
} from '../validations/comment.validation.js'
import { paginationValidation } from '../validations/post.validation.js'

const router = express.Router()

// Comment routes
router.post('/post/:postId', checkAuth, postIdValidation, addCommentValidation, addComment)
router.get('/post/:postId', checkAuth, postIdValidation, paginationValidation, getCommentsByPost)
router.put('/:commentId', checkAuth, commentIdValidation, updateCommentValidation, updateComment)
router.delete('/:commentId', checkAuth, commentIdValidation, deleteComment)

export default app => {
  app.use('/comments', router)
}