import {
  createPost as createPostService,
  getAllPosts as getAllPostsService,
  getPostById as getPostByIdService,
  updatePost as updatePostService,
  deletePost as deletePostService,
  getPostsByAuthor as getPostsByAuthorService
} from '../services/post.service.js'

async function createPost(req, res, next) {
  try {
    const { content } = req.body
    const authorId = req.userData.id
    const imageUrls = req.files ? req.files.map(file => file.location) : []

    const post = await createPostService(authorId, content, imageUrls)
    res.status(201).send({
      status: 'success',
      message: 'Post created successfully',
      data: post
    })
  } catch (error) {
    next(error)
  }
}

async function getAllPosts(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const userId = req.userData.id // Always available due to checkAuth middleware

    const result = await getAllPostsService(page, limit, userId)
    res.status(200).send({
      status: 'success',
      message: 'Posts retrieved successfully',
      data: result.posts,
      pagination: result.pagination
    })
  } catch (error) {
    next(error)
  }
}

async function getPostById(req, res, next) {
  try {
    const { postId } = req.params
    const userId = req.userData.id // Always available due to checkAuth middleware

    const post = await getPostByIdService(postId, userId)
    res.status(200).send({
      status: 'success',
      message: 'Post retrieved successfully',
      data: post
    })
  } catch (error) {
    next(error)
  }
}

async function updatePost(req, res, next) {
  try {
    const { postId } = req.params
    const { content, images } = req.body
    const authorId = req.userData.id
    const imageUrls = req.files ? req.files.map(file => file.location) : []

    const post = await updatePostService(postId, authorId, content, images, imageUrls)
    res.status(200).send({
      status: 'success',
      message: 'Post updated successfully',
      data: post
    })
  } catch (error) {
    next(error)
  }
}

async function deletePost(req, res, next) {
  try {
    const { postId } = req.params
    const authorId = req.userData.id

    const result = await deletePostService(postId, authorId)
    res.status(200).send({
      status: 'success',
      message: result.message
    })
  } catch (error) {
    next(error)
  }
}

async function getPostsByAuthor(req, res, next) {
  try {
    const { authorId } = req.params
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const userId = req.userData.id // Always available due to checkAuth middleware

    const result = await getPostsByAuthorService(authorId, page, limit, userId)
    res.status(200).send({
      status: 'success',
      message: 'Posts retrieved successfully',
      data: result.posts,
      pagination: result.pagination
    })
  } catch (error) {
    next(error)
  }
}

export {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getPostsByAuthor
}