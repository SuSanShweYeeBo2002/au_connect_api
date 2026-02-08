import Joi from 'joi'
import { objectId } from './utils.js'

const addReply = {
  params: Joi.object({
    commentId: Joi.string().custom(objectId).required()
  }),
  body: Joi.object({
    content: Joi.string().max(500).required(),
    image: Joi.string().uri().allow(null, '')
  })
}

const getRepliesByComment = {
  params: Joi.object({
    commentId: Joi.string().custom(objectId).required()
  }),
  query: Joi.object({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(50)
  })
}

const updateReply = {
  params: Joi.object({
    replyId: Joi.string().custom(objectId).required()
  }),
  body: Joi.object({
    content: Joi.string().max(500).required(),
    image: Joi.string().uri().allow(null, '')
  })
}

const deleteReply = {
  params: Joi.object({
    replyId: Joi.string().custom(objectId).required()
  })
}

export {
  addReply,
  getRepliesByComment,
  updateReply,
  deleteReply
}
