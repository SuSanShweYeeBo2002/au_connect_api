import Post from '../models/post.js'
import Like from '../models/like.js'

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

async function getAllPosts(page = 1, limit = 10, userId = null) {
  try {
    const skip = (page - 1) * limit
    const posts = await Post.find()
      .populate('author', 'email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
    
    const totalPosts = await Post.countDocuments()
    
    // If userId is provided, check which posts are liked by the user
    let postsWithLikeStatus = posts
    if (userId) {
      // Get all post IDs
      const postIds = posts.map(post => post._id)
      
      // Find likes by this user for these posts
      const userLikes = await Like.find({
        postId: { $in: postIds },
        userId: userId
      }).select('postId')
      
      // Create a Set of liked post IDs for quick lookup
      const likedPostIds = new Set(userLikes.map(like => like.postId.toString()))
      
      // Add isLikedByUser field to each post
      postsWithLikeStatus = posts.map(post => {
        const postObj = post.toObject()
        postObj.isLikedByUser = likedPostIds.has(post._id.toString())
        return postObj
      })
    }
    
    return {
      posts: postsWithLikeStatus,
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

async function getPostById(postId, userId = null) {
  try {
    const post = await Post.findById(postId)
      .populate('author', 'email')
    
    if (!post) {
      const err = new Error()
      err.message = 'Post not found'
      err.status = 404
      throw err
    }
    
    // If userId is provided, check if user has liked this post
    let postWithLikeStatus = post
    if (userId) {
      const userLike = await Like.findOne({ postId, userId })
      const postObj = post.toObject()
      postObj.isLikedByUser = !!userLike
      postWithLikeStatus = postObj
    }
    
    return postWithLikeStatus
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