import Joi from '@hapi/joi'

const createSponsorAdValidation = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required().min(1).max(100).trim(),
    sponsorName: Joi.string().required().min(1).max(100).trim(),
    link: Joi.string().required().uri().max(500).trim(),
    description: Joi.string().optional().allow('').max(500).trim(),
    startDate: Joi.date().required().iso(),
    endDate: Joi.date().required().iso().greater(Joi.ref('startDate')),
    status: Joi.string().valid('pending', 'active', 'paused', 'expired').optional()
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

const updateSponsorAdValidation = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().optional().min(1).max(100).trim(),
    sponsorName: Joi.string().optional().min(1).max(100).trim(),
    link: Joi.string().optional().uri().max(500).trim(),
    description: Joi.string().optional().allow('').max(500).trim(),
    startDate: Joi.date().optional().iso(),
    endDate: Joi.date().optional().iso(),
    status: Joi.string().valid('pending', 'active', 'paused', 'expired').optional()
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

const sponsorAdIdValidation = (req, res, next) => {
  const schema = Joi.object({
    adId: Joi.string().hex().length(24).required()
  })

  const { error } = schema.validate(req.params)
  if (error) {
    const err = new Error()
    err.message = 'Invalid sponsor ad ID'
    err.status = 400
    return next(err)
  }
  next()
}

const paginationValidation = (req, res, next) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    status: Joi.string().valid('pending', 'active', 'paused', 'expired').optional()
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
  createSponsorAdValidation,
  updateSponsorAdValidation,
  sponsorAdIdValidation,
  paginationValidation
}
