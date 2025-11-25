import Joi from '@hapi/joi'

const createNoteValidation = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required().min(1).max(200).trim(),
    content: Joi.string().required().min(1).max(5000).trim()
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

const updateNoteValidation = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required().min(1).max(200).trim(),
    content: Joi.string().required().min(1).max(5000).trim()
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

const noteIdValidation = (req, res, next) => {
  const schema = Joi.object({
    noteId: Joi.string().hex().length(24).required()
  })

  const { error } = schema.validate(req.params)
  if (error) {
    const err = new Error()
    err.message = 'Invalid note ID'
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
  createNoteValidation,
  updateNoteValidation,
  noteIdValidation,
  paginationValidation
}
