import {
  createPost as createPostService,
  getAllPosts as getAllPostsService,
  getPostById as getPostByIdService,
  updatePost as updatePostService,
  deletePost as deletePostService
} from '../services/post.service.js'

async function createPost(req, res, next) {
  try {
    const { content, image } = req.body
    const authorId = req.userData.id

    const post = await createPostService(authorId, content, image)
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

    const result = await getAllPostsService(page, limit)
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

    const post = await getPostByIdService(postId)
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
    const { content, image } = req.body
    const authorId = req.userData.id

    const post = await updatePostService(postId, authorId, content, image)
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

export {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
}