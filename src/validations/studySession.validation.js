import Joi from '@hapi/joi'

const createStudySessionValidation = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required().min(3).max(200).trim(),
    description: Joi.string().required().min(10).max(1000).trim(),
    subject: Joi.string().required().min(2).max(100).trim(),
    platform: Joi.string()
      .valid('Zoom', 'Google Meet', 'Microsoft Teams', 'Discord', 'Other')
      .required(),
    platformLink: Joi.string().uri().max(500).optional().allow('').allow(null),
    studyType: Joi.string()
      .valid('Online', 'Offline', 'Hybrid')
      .required(),
    location: Joi.string().max(300).optional().allow('').allow(null),
    maxParticipants: Joi.number().integer().min(2).optional().allow(null),
    scheduledDate: Joi.date().iso().greater('now').required(),
    duration: Joi.number().integer().min(15).required()
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

const updateStudySessionValidation = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(200).trim().optional(),
    description: Joi.string().min(10).max(1000).trim().optional(),
    subject: Joi.string().min(2).max(100).trim().optional(),
    platform: Joi.string()
      .valid('Zoom', 'Google Meet', 'Microsoft Teams', 'Discord', 'Other')
      .optional(),
    platformLink: Joi.string().uri().max(500).optional().allow('').allow(null),
    studyType: Joi.string()
      .valid('Online', 'Offline', 'Hybrid')
      .optional(),
    location: Joi.string().max(300).optional().allow('').allow(null),
    maxParticipants: Joi.number().integer().min(2).optional().allow(null),
    scheduledDate: Joi.date().iso().greater('now').optional(),
    duration: Joi.number().integer().min(15).optional(),
    status: Joi.string()
      .valid('Scheduled', 'Ongoing', 'Completed', 'Cancelled')
      .optional()
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

const studySessionIdValidation = (req, res, next) => {
  const schema = Joi.object({
    sessionId: Joi.string().hex().length(24).required()
  })

  const { error } = schema.validate(req.params)
  if (error) {
    const err = new Error()
    err.message = 'Invalid study session ID'
    err.status = 400
    return next(err)
  }
  next()
}

const paginationValidation = (req, res, next) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(50).optional(),
    status: Joi.string()
      .valid('Scheduled', 'Ongoing', 'Completed', 'Cancelled')
      .optional(),
    studyType: Joi.string()
      .valid('Online', 'Offline', 'Hybrid')
      .optional()
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
  createStudySessionValidation,
  updateStudySessionValidation,
  studySessionIdValidation,
  paginationValidation
}
