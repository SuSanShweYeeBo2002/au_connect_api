import express from 'express'
import { checkAuth } from '../middlewares/auth.middleware.js'
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost
} from '../controllers/post.controller.js'
import {
  createPostValidation,
  updatePostValidation,
  postIdValidation,
  paginationValidation
} from '../validations/post.validation.js'

const router = express.Router()

// Post CRUD routes
router.post('/', checkAuth, createPostValidation, createPost)
router.get('/', paginationValidation, getAllPosts) // Public route to view all posts
router.get('/:postId', postIdValidation, getPostById)
router.put('/:postId', checkAuth, postIdValidation, updatePostValidation, updatePost)
router.delete('/:postId', checkAuth, postIdValidation, deletePost)

// Like/Unlike post
router.post('/:postId/like', checkAuth, postIdValidation, likePost)

export default app => {
  app.use('/posts', router)
}