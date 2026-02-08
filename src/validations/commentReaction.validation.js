import Joi from 'joi'
import { objectId } from './utils.js'

const addOrUpdateReaction = {
  params: Joi.object({
    commentId: Joi.string().custom(objectId).required()
  }),
  body: Joi.object({
    reactionType: Joi.string()
      .valid('like', 'love', 'haha', 'wow', 'sad', 'angry')
      .required()
  })
}

const removeReaction = {
  params: Joi.object({
    commentId: Joi.string().custom(objectId).required()
  })
}

const getReactionsByComment = {
  params: Joi.object({
    commentId: Joi.string().custom(objectId).required()
  }),
  query: Joi.object({
    reactionType: Joi.string()
      .valid('like', 'love', 'haha', 'wow', 'sad', 'angry')
      .allow('')
  })
}

const getUserReaction = {
  params: Joi.object({
    commentId: Joi.string().custom(objectId).required()
  })
}

export {
  addOrUpdateReaction,
  removeReaction,
  getReactionsByComment,
  getUserReaction
}
