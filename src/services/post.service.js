import Post from '../models/post.js'
import Like from '../models/like.js'
import { getBlockedUserIdsService, getUsersWhoBlockedMeService } from './block.service.js'
import { deleteFromS3 } from '../utils/s3.js'

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
    
    // Get blocked users and users who blocked current user
    let excludedUserIds = []
    if (userId) {
      const blockedByMe = await getBlockedUserIdsService(userId)
      const whoBlockedMe = await getUsersWhoBlockedMeService(userId)
      excludedUserIds = [...blockedByMe, ...whoBlockedMe]
    }
    
    // Build query to exclude posts from blocked users
    const query = excludedUserIds.length > 0 
      ? { author: { $nin: excludedUserIds } }
      : {}
    
    const posts = await Post.find(query)
      .populate('author', 'email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
    
    const totalPosts = await Post.countDocuments(query)
    
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
    
    // Check if post author is blocked or has blocked current user
    if (userId) {
      const blockedByMe = await getBlockedUserIdsService(userId)
      const whoBlockedMe = await getUsersWhoBlockedMeService(userId)
      const authorId = post.author._id.toString()
      
      if (blockedByMe.includes(authorId) || whoBlockedMe.includes(authorId)) {
        const err = new Error()
        err.message = 'Post not found'
        err.status = 404
        throw err
      }
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
    
    // If new image is uploaded, delete old image from S3
    if (image !== null && post.image) {
      try {
        await deleteFromS3(post.image)
      } catch (error) {
        console.error('Error deleting old post image:', error)
      }
    }
    
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
    
    // Delete image from S3 if exists
    if (post.image) {
      try {
        await deleteFromS3(post.image)
      } catch (error) {
        console.error('Error deleting post image from S3:', error)
      }
    }
    
    return { message: 'Post deleted successfully' }
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function getPostsByAuthor(authorId, page = 1, limit = 10, userId = null) {
  try {
    const skip = (page - 1) * limit
    const posts = await Post.find({ author: authorId })
      .populate('author', 'email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
    
    const totalPosts = await Post.countDocuments({ author: authorId })
    
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
    err.status = error.status || 500
    throw err
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