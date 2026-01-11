import express from 'express'
import { checkAuth } from '../middlewares/auth.middleware.js'
import { reportPostController } from '../controllers/report.controller.js'
import { reportPostValidation, postIdValidation } from '../validations/report.validation.js'

const router = express.Router()

router.post('/post/:postId', checkAuth, postIdValidation, reportPostValidation, reportPostController)

export default app => {
  app.use('/reports', router)
}
