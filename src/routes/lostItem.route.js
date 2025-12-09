import express from 'express'
import { checkAuth } from '../middlewares/auth.middleware.js'
import {
  createLostItem,
  getAllLostItems,
  getLostItemById,
  updateLostItem,
  deleteLostItem,
  getLostItemsByReporter
} from '../controllers/lostItem.controller.js'
import {
  createLostItemValidation,
  updateLostItemValidation,
  lostItemIdValidation,
  reporterIdValidation,
  paginationValidation
} from '../validations/lostItem.validation.js'

const router = express.Router()

// Lost Item CRUD routes
router.post('/', checkAuth, createLostItemValidation, createLostItem)
router.get('/', checkAuth, paginationValidation, getAllLostItems)
router.get('/reporter/:reporterId', checkAuth, reporterIdValidation, paginationValidation, getLostItemsByReporter)
router.get('/:itemId', checkAuth, lostItemIdValidation, getLostItemById)
router.put('/:itemId', checkAuth, lostItemIdValidation, updateLostItemValidation, updateLostItem)
router.delete('/:itemId', checkAuth, lostItemIdValidation, deleteLostItem)

export default app => {
  app.use('/lost-items', router)
}
