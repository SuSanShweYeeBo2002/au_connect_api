import express from 'express'
import { checkAuth } from '../middlewares/auth.middleware.js'
import {
  toggleLike,
  getLikesByPost,
  checkUserLiked,
  getUserLikes
} from '../controllers/like.controller.js'
import {
  postIdValidation,
  paginationValidation
} from '../validations/like.validation.js'

const router = express.Router()

// Like routes
router.post('/post/:postId', checkAuth, postIdValidation, toggleLike)
router.get('/post/:postId', postIdValidation, paginationValidation, getLikesByPost)
router.get('/post/:postId/check', checkAuth, postIdValidation, checkUserLiked)
router.get('/user/me', checkAuth, paginationValidation, getUserLikes)

export default app => {
  app.use('/likes', router)
}