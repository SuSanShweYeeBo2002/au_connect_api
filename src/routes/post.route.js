import express from 'express'
import { checkAuth } from '../middlewares/auth.middleware.js'
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getPostsByAuthor
} from '../controllers/post.controller.js'
import {
  createPostValidation,
  updatePostValidation,
  postIdValidation,
  paginationValidation,
  authorIdValidation
} from '../validations/post.validation.js'

const router = express.Router()

// Post CRUD routes
router.post('/', checkAuth, createPostValidation, createPost)
router.get('/', checkAuth, paginationValidation, getAllPosts) // Protected route with like status
router.get('/author/:authorId', checkAuth, authorIdValidation, paginationValidation, getPostsByAuthor) // Get posts by author
router.get('/:postId', checkAuth, postIdValidation, getPostById) // Protected route with like status
router.put('/:postId', checkAuth, postIdValidation, updatePostValidation, updatePost)
router.delete('/:postId', checkAuth, postIdValidation, deletePost)

export default app => {
  app.use('/posts', router)
}