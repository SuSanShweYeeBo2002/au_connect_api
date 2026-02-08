import CommentReply from '../models/commentReply.js'
import Comment from '../models/comment.js'

async function addReply(commentId, authorId, content, image = null) {
  try {
    // Check if comment exists
    const comment = await Comment.findById(commentId)
    if (!comment) {
      const err = new Error()
      err.message = 'Comment not found'
      err.status = 404
      throw err
    }

    // Create reply
    const reply = await new CommentReply({
      commentId,
      author: authorId,
      content,
      image
    }).save()

    // Increment reply count on comment
    await Comment.findByIdAndUpdate(commentId, { $inc: { replyCount: 1 } })

    return reply.populate('author', 'email displayName profileImage')
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function getRepliesByComment(commentId, page = 1, limit = 10) {
  try {
    const skip = (page - 1) * limit
    const replies = await CommentReply.find({ commentId })
      .populate('author', 'email displayName profileImage')
      .sort({ createdAt: 1 }) // Oldest first for replies
      .skip(skip)
      .limit(limit)

    const totalReplies = await CommentReply.countDocuments({ commentId })

    return {
      replies,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalReplies / limit),
        totalReplies,
        hasNext: page < Math.ceil(totalReplies / limit),
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

async function updateReply(replyId, authorId, content, image = null) {
  try {
    const reply = await CommentReply.findOne({ _id: replyId, author: authorId })
    
    if (!reply) {
      const err = new Error()
      err.message = 'Reply not found or unauthorized'
      err.status = 404
      throw err
    }

    reply.content = content
    if (image !== null) {
      reply.image = image
    }
    await reply.save()

    return reply.populate('author', 'email displayName profileImage')
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function deleteReply(replyId, userId) {
  try {
    const reply = await CommentReply.findById(replyId).populate({
      path: 'commentId',
      populate: {
        path: 'author'
      }
    })
    
    if (!reply) {
      const err = new Error()
      err.message = 'Reply not found'
      err.status = 404
      throw err
    }

    // Check if user is the reply author or comment author
    if (reply.author.toString() !== userId.toString() && 
        reply.commentId.author._id.toString() !== userId.toString()) {
      const err = new Error()
      err.message = 'Unauthorized to delete this reply'
      err.status = 403
      throw err
    }

    const commentId = reply.commentId._id
    await CommentReply.findByIdAndDelete(replyId)
    
    // Decrement reply count on comment
    await Comment.findByIdAndUpdate(commentId, { $inc: { replyCount: -1 } })

    return { message: 'Reply deleted successfully' }
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

export {
  addReply,
  getRepliesByComment,
  updateReply,
  deleteReply
}
