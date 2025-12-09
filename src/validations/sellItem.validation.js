import Joi from '@hapi/joi'

const createSellItemValidation = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required().min(1).max(200).trim(),
    description: Joi.string().required().min(1).max(2000).trim(),
    price: Joi.number().required().min(0),
    category: Joi.string().required().valid('Electronics', 'Books', 'Clothing', 'Furniture', 'Sports', 'Other'),
    condition: Joi.string().required().valid('New', 'Like New', 'Good', 'Fair', 'Poor'),
    images: Joi.array().items(Joi.string().uri()).optional(),
    contactInfo: Joi.object({
      phone: Joi.string().optional().allow(''),
      email: Joi.string().email().optional().allow('')
    }).optional(),
    status: Joi.string().valid('Available', 'Sold', 'Reserved').optional()
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

const updateSellItemValidation = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(1).max(200).trim().optional(),
    description: Joi.string().min(1).max(2000).trim().optional(),
    price: Joi.number().min(0).optional(),
    category: Joi.string().valid('Electronics', 'Books', 'Clothing', 'Furniture', 'Sports', 'Other').optional(),
    condition: Joi.string().valid('New', 'Like New', 'Good', 'Fair', 'Poor').optional(),
    images: Joi.array().items(Joi.string().uri()).optional(),
    contactInfo: Joi.object({
      phone: Joi.string().optional().allow(''),
      email: Joi.string().email().optional().allow('')
    }).optional(),
    status: Joi.string().valid('Available', 'Sold', 'Reserved').optional()
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

const sellItemIdValidation = (req, res, next) => {
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

const sellerIdValidation = (req, res, next) => {
  const schema = Joi.object({
    sellerId: Joi.string().hex().length(24).required()
  })

  const { error } = schema.validate(req.params)
  if (error) {
    const err = new Error()
    err.message = 'Invalid seller ID'
    err.status = 400
    return next(err)
  }
  next()
}

const paginationValidation = (req, res, next) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    category: Joi.string().valid('Electronics', 'Books', 'Clothing', 'Furniture', 'Sports', 'Other').optional(),
    status: Joi.string().valid('Available', 'Sold', 'Reserved').optional(),
    condition: Joi.string().valid('New', 'Like New', 'Good', 'Fair', 'Poor').optional(),
    minPrice: Joi.number().min(0).optional(),
    maxPrice: Joi.number().min(0).optional(),
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
  createSellItemValidation,
  updateSellItemValidation,
  sellItemIdValidation,
  sellerIdValidation,
  paginationValidation
}
