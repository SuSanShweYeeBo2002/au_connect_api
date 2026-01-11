import Joi from '@hapi/joi'

export const reportPostValidation = (req, res, next) => {
  const schema = Joi.object({
    reason: Joi.string().min(5).max(500).required()
  })

  const { error } = schema.validate(req.body)
  if (error) {
    const err = new Error()
    err.message = error.details[0].message
    err.status = 400
    return next(err)
  }
  next()
}

export const postIdValidation = (req, res, next) => {
  const schema = Joi.object({
    postId: Joi.string().hex().length(24).required()
  })

  const { error } = schema.validate(req.params)
  if (error) {
    const err = new Error()
    err.message = 'Invalid post ID'
    err.status = 400
    return next(err)
  }
  next()
}
