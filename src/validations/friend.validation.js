import Joi from '@hapi/joi'
import { checkValidation } from './utils.js'

export const sendFriendRequestValidation = (req, res, next) => {
  const { recipientId } = req.body

  const schema = Joi.object({
    recipientId: Joi.string().required()
  })
  
  const data = { recipientId }
  checkValidation(schema, data)
  next()
}

export const respondFriendRequestValidation = (req, res, next) => {
  const { requestId } = req.params
  const { status } = req.body

  const schema = Joi.object({
    requestId: Joi.string().required(),
    status: Joi.string().valid('accepted', 'rejected').required()
  })
  
  const data = { requestId, status }
  checkValidation(schema, data)
  next()
}

export const unfriendValidation = (req, res, next) => {
  const { friendId } = req.params

  const schema = Joi.object({
    friendId: Joi.string().required()
  })
  
  const data = { friendId }
  checkValidation(schema, data)
  next()
}
