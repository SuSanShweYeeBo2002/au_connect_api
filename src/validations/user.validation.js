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

export const updateUserValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional()
  }).min(1)

  const { error } = schema.validate(req.body)
  if (error) {
    const err = new Error()
    err.message = error.details[0].message
    err.status = 400
    return next(err)
  }
  next()
}

export const userIdValidation = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.string().hex().length(24).required()
  })

  const { error } = schema.validate(req.params)
  if (error) {
    const err = new Error()
    err.message = 'Invalid user ID'
    err.status = 400
    return next(err)
  }
  next()
}
