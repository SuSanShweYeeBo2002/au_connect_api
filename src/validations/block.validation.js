import Joi from '@hapi/joi'
import { checkValidation } from './utils.js'

export const blockUserValidation = (req, res, next) => {
  const { blockedId } = req.body

  const schema = Joi.object({
    blockedId: Joi.string().required()
  })
  
  const data = { blockedId }
  checkValidation(schema, data)
  next()
}

export const unblockUserValidation = (req, res, next) => {
  const { blockedId } = req.params

  const schema = Joi.object({
    blockedId: Joi.string().required()
  })
  
  const data = { blockedId }
  checkValidation(schema, data)
  next()
}
