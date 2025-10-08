import {
  toggleLike as toggleLikeService,
  getLikesByPost as getLikesByPostService,
  checkUserLiked as checkUserLikedService,
  getUserLikes as getUserLikesService
} from '../services/like.service.js'

async function toggleLike(req, res, next) {
  try {
    const { postId } = req.params
    const userId = req.userData.id

    const result = await toggleLikeService(postId, userId)
    res.status(200).send({
      status: 'success',
      message: result.message,
      data: {
        action: result.action,
        likeCount: result.likeCount
      }
    })
  } catch (error) {
    next(error)
  }
}

async function getLikesByPost(req, res, next) {
  try {
    const { postId } = req.params
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20

    const result = await getLikesByPostService(postId, page, limit)
    res.status(200).send({
      status: 'success',
      message: 'Likes retrieved successfully',
      data: result.likes,
      pagination: result.pagination
    })
  } catch (error) {
    next(error)
  }
}

async function checkUserLiked(req, res, next) {
  try {
    const { postId } = req.params
    const userId = req.userData.id

    const result = await checkUserLikedService(postId, userId)
    res.status(200).send({
      status: 'success',
      message: 'Like status retrieved successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

async function getUserLikes(req, res, next) {
  try {
    const userId = req.userData.id
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    const result = await getUserLikesService(userId, page, limit)
    res.status(200).send({
      status: 'success',
      message: 'User likes retrieved successfully',
      data: result.likes,
      pagination: result.pagination
    })
  } catch (error) {
    next(error)
  }
}

export {
  toggleLike,
  getLikesByPost,
  checkUserLiked,
  getUserLikes
}