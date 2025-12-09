import express from 'express'
import { checkAuth } from '../middlewares/auth.middleware.js'
import {
  createSellItem,
  getAllSellItems,
  getSellItemById,
  updateSellItem,
  deleteSellItem,
  getSellItemsBySeller
} from '../controllers/sellItem.controller.js'
import {
  createSellItemValidation,
  updateSellItemValidation,
  sellItemIdValidation,
  sellerIdValidation,
  paginationValidation
} from '../validations/sellItem.validation.js'

const router = express.Router()

// Sell Item CRUD routes
router.post('/', checkAuth, createSellItemValidation, createSellItem)
router.get('/', checkAuth, paginationValidation, getAllSellItems)
router.get('/seller/:sellerId', checkAuth, sellerIdValidation, paginationValidation, getSellItemsBySeller)
router.get('/:itemId', checkAuth, sellItemIdValidation, getSellItemById)
router.put('/:itemId', checkAuth, sellItemIdValidation, updateSellItemValidation, updateSellItem)
router.delete('/:itemId', checkAuth, sellItemIdValidation, deleteSellItem)

export default app => {
  app.use('/sell-items', router)
}
