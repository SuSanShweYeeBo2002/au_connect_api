import Joi from '@hapi/joi'

const createPollValidation = (req, res, next) => {
  const schema = Joi.object({
    question: Joi.string().required().min(5).max(500).trim(),
    options: Joi.array()
      .items(Joi.string().min(1).max(200).trim())
      .min(2)
      .max(6)
      .required(),
    expiresAt: Joi.date().iso().greater('now').optional().allow(null)
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

const votePollValidation = (req, res, next) => {
  const schema = Joi.object({
    optionIndex: Joi.number().integer().min(0).max(5).required()
  })

  const { error } = schema.validate(req.body)
  if (error) {
    const err = new Error()
    err.message = 'Invalid option index'
    err.status = 400
    return next(err)
  }
  next()
}

const pollIdValidation = (req, res, next) => {
  const schema = Joi.object({
    pollId: Joi.string().hex().length(24).required()
  })

  const { error } = schema.validate(req.params)
  if (error) {
    const err = new Error()
    err.message = 'Invalid poll ID'
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
  createPollValidation,
  votePollValidation,
  pollIdValidation,
  paginationValidation
}
