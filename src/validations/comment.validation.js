import Joi from '@hapi/joi'

const addCommentValidation = (req, res, next) => {
  const schema = Joi.object({
    content: Joi.string().required().min(1).max(500).trim(),
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

const updateCommentValidation = (req, res, next) => {
  const schema = Joi.object({
    content: Joi.string().required().min(1).max(500).trim(),
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

const commentIdValidation = (req, res, next) => {
  const schema = Joi.object({
    commentId: Joi.string().hex().length(24).required()
  })

  const { error } = schema.validate(req.params)
  if (error) {
    const err = new Error()
    err.message = 'Invalid comment ID'
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

export {
  addCommentValidation,
  updateCommentValidation,
  commentIdValidation,
  postIdValidation
}