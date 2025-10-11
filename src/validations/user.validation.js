import Joi from '@hapi/joi'
import { checkValidation } from './utils.js'

export const signupValidation = (req, res, next) => {
  const { email, password } = req.body

  const schema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().required()
  })
  const data = {
    email,
    password
  }
  checkValidation(schema, data)
  next()
}

export const signinValidation = (req, res, next) => {
  const { email, password } = req.body

  const schema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().required()
  })
  const data = {
    email,
    password
  }
  checkValidation(schema, data)
  next()
}
