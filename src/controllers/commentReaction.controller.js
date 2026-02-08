import {
  addOrUpdateReaction as addOrUpdateReactionService,
  removeReaction as removeReactionService,
  getReactionsByComment as getReactionsByCommentService,
  getUserReaction as getUserReactionService
} from '../services/commentReaction.service.js'

async function addOrUpdateReaction(req, res, next) {
  try {
    const { commentId } = req.params
    const { reactionType } = req.body
    const userId = req.userData.id

    const result = await addOrUpdateReactionService(commentId, userId, reactionType)
    res.status(200).send({
      status: 'success',
      message: result.message,
      data: result.reaction
    })
  } catch (error) {
    next(error)
  }
}

async function removeReaction(req, res, next) {
  try {
    const { commentId } = req.params
    const userId = req.userData.id

    const result = await removeReactionService(commentId, userId)
    res.status(200).send({
      status: 'success',
      message: result.message
    })
  } catch (error) {
    next(error)
  }
}

async function getReactionsByComment(req, res, next) {
  try {
    const { commentId } = req.params
    const { reactionType } = req.query

    const result = await getReactionsByCommentService(commentId, reactionType)
    res.status(200).send({
      status: 'success',
      message: 'Reactions retrieved successfully',
      data: {
        reactions: result.reactions,
        counts: result.counts,
        total: result.total
      }
    })
  } catch (error) {
    next(error)
  }
}

async function getUserReaction(req, res, next) {
  try {
    const { commentId } = req.params
    const userId = req.userData.id

    const reaction = await getUserReactionService(commentId, userId)
    res.status(200).send({
      status: 'success',
      message: reaction ? 'User reaction found' : 'No reaction found',
      data: reaction
    })
  } catch (error) {
    next(error)
  }
}

export {
  addOrUpdateReaction,
  removeReaction,
  getReactionsByComment,
  getUserReaction
}
