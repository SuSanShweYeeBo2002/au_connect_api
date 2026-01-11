import Comment from '../models/comment.js'
import Post from '../models/post.js'

async function addComment(postId, authorId, content, image = null) {
  try {
    // Check if post exists
    const post = await Post.findById(postId)
    if (!post) {
      const err = new Error()
      err.message = 'Post not found'
      err.status = 404
      throw err
    }

    // Create comment
    const comment = await new Comment({
      postId,
      author: authorId,
      content,
      image
    }).save()

    // Increment comment count on post
    await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } })

    return comment.populate('author', 'email displayName profileImage')
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function getCommentsByPost(postId, page = 1, limit = 10) {
  try {
    const skip = (page - 1) * limit
    const comments = await Comment.find({ postId })
      .populate('author', 'email displayName profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const totalComments = await Comment.countDocuments({ postId })

    return {
      comments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalComments / limit),
        totalComments,
        hasNext: page < Math.ceil(totalComments / limit),
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

async function updateComment(commentId, authorId, content, image = null) {
  try {
    const comment = await Comment.findOne({ _id: commentId, author: authorId })
    
    if (!comment) {
      const err = new Error()
      err.message = 'Comment not found or unauthorized'
      err.status = 404
      throw err
    }

    comment.content = content
    if (image !== null) {
      comment.image = image
    }
    await comment.save()

    return comment.populate('author', 'email displayName profileImage')
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function deleteComment(commentId, userId) {
  try {
    const comment = await Comment.findById(commentId).populate('postId', 'author')
    
    if (!comment) {
      const err = new Error()
      err.message = 'Comment not found'
      err.status = 404
      throw err
    }

    // Check if user is the comment author or post author
    if (comment.author.toString() !== userId.toString() && 
        comment.postId.author.toString() !== userId.toString()) {
      const err = new Error()
      err.message = 'Unauthorized to delete this comment'
      err.status = 403
      throw err
    }

    const postId = comment.postId._id
    await Comment.findByIdAndDelete(commentId)
    
    // Decrement comment count on post
    await Post.findByIdAndUpdate(postId, { $inc: { commentCount: -1 } })

    return { message: 'Comment deleted successfully' }
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

export {
  addComment,
  getCommentsByPost,
  updateComment,
  deleteComment
}