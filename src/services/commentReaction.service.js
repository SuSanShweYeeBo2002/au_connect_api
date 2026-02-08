import CommentReaction from '../models/commentReaction.js'
import Comment from '../models/comment.js'
import mongoose from 'mongoose'

async function addOrUpdateReaction(commentId, userId, reactionType) {
  try {
    // Check if comment exists
    const comment = await Comment.findById(commentId)
    if (!comment) {
      const err = new Error()
      err.message = 'Comment not found'
      err.status = 404
      throw err
    }

    // Check if user already reacted to this comment
    let reaction = await CommentReaction.findOne({ commentId, user: userId })

    if (reaction) {
      // Update existing reaction
      const oldReactionType = reaction.reactionType
      if (oldReactionType !== reactionType) {
        reaction.reactionType = reactionType
        await reaction.save()
        return { 
          reaction: reaction.populate('user', 'email displayName profileImage'),
          message: 'Reaction updated successfully'
        }
      }
      return {
        reaction: reaction.populate('user', 'email displayName profileImage'),
        message: 'Reaction already exists'
      }
    } else {
      // Create new reaction
      reaction = await new CommentReaction({
        commentId,
        user: userId,
        reactionType
      }).save()

      // Increment reaction count on comment
      await Comment.findByIdAndUpdate(commentId, { $inc: { reactionCount: 1 } })

      return {
        reaction: await reaction.populate('user', 'email displayName profileImage'),
        message: 'Reaction added successfully'
      }
    }
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function removeReaction(commentId, userId) {
  try {
    const reaction = await CommentReaction.findOneAndDelete({ commentId, user: userId })
    
    if (!reaction) {
      const err = new Error()
      err.message = 'Reaction not found'
      err.status = 404
      throw err
    }

    // Decrement reaction count on comment
    await Comment.findByIdAndUpdate(commentId, { $inc: { reactionCount: -1 } })

    return { message: 'Reaction removed successfully' }
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function getReactionsByComment(commentId, reactionType = null) {
  try {
    const query = { commentId }
    if (reactionType) {
      query.reactionType = reactionType
    }

    const reactions = await CommentReaction.find(query)
      .populate('user', 'email displayName profileImage')
      .sort({ createdAt: -1 })

    // Get reaction counts by type - convert commentId to ObjectId for aggregate
    const reactionCounts = await CommentReaction.aggregate([
      { $match: { commentId: new mongoose.Types.ObjectId(commentId) } },
      { $group: { _id: '$reactionType', count: { $sum: 1 } } }
    ])

    const counts = {}
    reactionCounts.forEach(rc => {
      counts[rc._id] = rc.count
    })

    return {
      reactions,
      counts,
      total: reactions.length
    }
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function getUserReaction(commentId, userId) {
  try {
    const reaction = await CommentReaction.findOne({ commentId, user: userId })
      .populate('user', 'email displayName profileImage')
    
    return reaction
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

export {
  addOrUpdateReaction,
  removeReaction,
  getReactionsByComment,
  getUserReaction
}
