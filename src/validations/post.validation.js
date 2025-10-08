import Joi from '@hapi/joi'

const createPostValidation = (req, res, next) => {
  const schema = Joi.object({
    content: Joi.string().required().min(1).max(1000).trim(),
    image: Joi.string().uri().optional().allow('').allow(null)
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

const updatePostValidation = (req, res, next) => {
  const schema = Joi.object({
    content: Joi.string().required().min(1).max(1000).trim(),
    image: Joi.string().uri().optional().allow('').allow(null)
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

const postIdValidation = (req, res, next) => {
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

// Pagination validation for query parameters
const paginationValidation = (req, res, next) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(50).optional()
  })

  const { error } = schema.validate(req.query)
  if (error) {
    const err = new Error()
    err.message = error.details[0].message
    err.status = 400
    return next(err)
  }
  next()
}

export {
  createPostValidation,
  updatePostValidation,
  postIdValidation,
  paginationValidation
}