import Post from '../models/post.js'

async function createPost(authorId, content, image = null) {
  try {
    const post = await new Post({
      author: authorId,
      content,
      image
    }).save()
    
    return post.populate('author', 'email')
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status
    throw err
  }
}

async function getAllPosts(page = 1, limit = 10) {
  try {
    const skip = (page - 1) * limit
    const posts = await Post.find()
      .populate('author', 'email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
    
    const totalPosts = await Post.countDocuments()
    
    return {
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts,
        hasNext: page < Math.ceil(totalPosts / limit),
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

async function getPostById(postId) {
  try {
    const post = await Post.findById(postId)
      .populate('author', 'email')
    
    if (!post) {
      const err = new Error()
      err.message = 'Post not found'
      err.status = 404
      throw err
    }
    
    return post
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function updatePost(postId, authorId, content, image = null) {
  try {
    const post = await Post.findOne({ _id: postId, author: authorId })
    
    if (!post) {
      const err = new Error()
      err.message = 'Post not found or unauthorized'
      err.status = 404
      throw err
    }
    
    post.content = content
    if (image !== null) {
      post.image = image
    }
    
    await post.save()
    return post.populate('author', 'email')
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function deletePost(postId, authorId) {
  try {
    const post = await Post.findOneAndDelete({ _id: postId, author: authorId })
    
    if (!post) {
      const err = new Error()
      err.message = 'Post not found or unauthorized'
      err.status = 404
      throw err
    }
    
    return { message: 'Post deleted successfully' }
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

export {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
}