import Like from '../models/like.js'
import Post from '../models/post.js'

async function toggleLike(postId, userId) {
  try {
    // Check if post exists
    const post = await Post.findById(postId)
    if (!post) {
      const err = new Error()
      err.message = 'Post not found'
      err.status = 404
      throw err
    }

    // Check if user already liked the post
    const existingLike = await Like.findOne({ postId, userId })

    if (existingLike) {
      // Unlike: remove like and decrement count
      await Like.findByIdAndDelete(existingLike._id)
      await Post.findByIdAndUpdate(postId, { $inc: { likeCount: -1 } })
      
      return {
        action: 'unliked',
        message: 'Post unliked successfully',
        likeCount: post.likeCount - 1
      }
    } else {
      // Like: add like and increment count
      await new Like({ postId, userId }).save()
      await Post.findByIdAndUpdate(postId, { $inc: { likeCount: 1 } })
      
      return {
        action: 'liked',
        message: 'Post liked successfully',
        likeCount: post.likeCount + 1
      }
    }
  } catch (error) {
    // Handle duplicate key error (race condition)
    if (error.code === 11000) {
      const err = new Error()
      err.message = 'You have already liked this post'
      err.status = 400
      throw err
    }
    
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function getLikesByPost(postId, page = 1, limit = 20) {
  try {
    const skip = (page - 1) * limit
    const likes = await Like.find({ postId })
      .populate('userId', 'email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const totalLikes = await Like.countDocuments({ postId })

    return {
      likes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalLikes / limit),
        totalLikes,
        hasNext: page < Math.ceil(totalLikes / limit),
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

async function checkUserLiked(postId, userId) {
  try {
    const like = await Like.findOne({ postId, userId })
    return { liked: !!like }
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function getUserLikes(userId, page = 1, limit = 10) {
  try {
    const skip = (page - 1) * limit
    const likes = await Like.find({ userId })
      .populate('postId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const totalLikes = await Like.countDocuments({ userId })

    return {
      likes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalLikes / limit),
        totalLikes,
        hasNext: page < Math.ceil(totalLikes / limit),
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
  toggleLike,
  getLikesByPost,
  checkUserLiked,
  getUserLikes
}