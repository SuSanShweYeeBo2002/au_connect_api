import Joi from '@hapi/joi'

const createLostItemValidation = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required().min(1).max(200).trim(),
    description: Joi.string().required().min(1).max(2000).trim(),
    category: Joi.string().required().valid('Electronics', 'Documents', 'Keys', 'Bags', 'Clothing', 'Jewelry', 'Books', 'Other'),
    type: Joi.string().required().valid('Lost', 'Found'),
    location: Joi.string().required().min(1).max(300).trim(),
    dateReported: Joi.date().optional(),
    images: Joi.array().items(Joi.string().uri()).optional(),
    contactInfo: Joi.object({
      phone: Joi.string().optional().allow(''),
      email: Joi.string().email().optional().allow('')
    }).optional(),
    status: Joi.string().valid('Active', 'Resolved', 'Closed').optional()
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

const updateLostItemValidation = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(1).max(200).trim().optional(),
    description: Joi.string().min(1).max(2000).trim().optional(),
    category: Joi.string().valid('Electronics', 'Documents', 'Keys', 'Bags', 'Clothing', 'Jewelry', 'Books', 'Other').optional(),
    type: Joi.string().valid('Lost', 'Found').optional(),
    location: Joi.string().min(1).max(300).trim().optional(),
    dateReported: Joi.date().optional(),
    images: Joi.array().items(Joi.string().uri()).optional(),
    contactInfo: Joi.object({
      phone: Joi.string().optional().allow(''),
      email: Joi.string().email().optional().allow('')
    }).optional(),
    status: Joi.string().valid('Active', 'Resolved', 'Closed').optional()
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

const lostItemIdValidation = (req, res, next) => {
  const schema = Joi.object({
    itemId: Joi.string().hex().length(24).required()
  })

  const { error } = schema.validate(req.params)
  if (error) {
    const err = new Error()
    err.message = 'Invalid item ID'
    err.status = 400
    return next(err)
  }
  next()
}

const reporterIdValidation = (req, res, next) => {
  const schema = Joi.object({
    reporterId: Joi.string().hex().length(24).required()
  })

  const { error } = schema.validate(req.params)
  if (error) {
    const err = new Error()
    err.message = 'Invalid reporter ID'
    err.status = 400
    return next(err)
  }
  next()
}

const paginationValidation = (req, res, next) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    category: Joi.string().valid('Electronics', 'Documents', 'Keys', 'Bags', 'Clothing', 'Jewelry', 'Books', 'Other').optional(),
    type: Joi.string().valid('Lost', 'Found').optional(),
    status: Joi.string().valid('Active', 'Resolved', 'Closed').optional(),
    search: Joi.string().optional()
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
  createLostItemValidation,
  updateLostItemValidation,
  lostItemIdValidation,
  reporterIdValidation,
  paginationValidation
}
