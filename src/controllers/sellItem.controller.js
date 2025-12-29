import {
  createSellItem as createSellItemService,
  getAllSellItems as getAllSellItemsService,
  getSellItemById as getSellItemByIdService,
  updateSellItem as updateSellItemService,
  deleteSellItem as deleteSellItemService,
  getSellItemsBySeller as getSellItemsBySellerService
} from '../services/sellItem.service.js'

async function createSellItem(req, res, next) {
  try {
    const sellerId = req.userData.id
    const itemData = req.body
    const imageUrls = req.files ? req.files.map(file => file.location) : []

    const sellItem = await createSellItemService(sellerId, itemData, imageUrls)
    res.status(201).send({
      status: 'success',
      message: 'Sell item created successfully',
      data: sellItem
    })
  } catch (error) {
    next(error)
  }
}

async function getAllSellItems(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    
    // Build filters from query params
    const filters = {}
    if (req.query.category) filters.category = req.query.category
    if (req.query.status) filters.status = req.query.status
    if (req.query.condition) filters.condition = req.query.condition
    if (req.query.minPrice) filters.minPrice = parseFloat(req.query.minPrice)
    if (req.query.maxPrice) filters.maxPrice = parseFloat(req.query.maxPrice)
    if (req.query.search) filters.search = req.query.search

    const result = await getAllSellItemsService(page, limit, filters)
    res.status(200).send({
      status: 'success',
      message: 'Sell items retrieved successfully',
      data: result.sellItems,
      pagination: result.pagination
    })
  } catch (error) {
    next(error)
  }
}

async function getSellItemById(req, res, next) {
  try {
    const { itemId } = req.params

    const sellItem = await getSellItemByIdService(itemId)
    res.status(200).send({
      status: 'success',
      message: 'Sell item retrieved successfully',
      data: sellItem
    })
  } catch (error) {
    next(error)
  }
}

async function updateSellItem(req, res, next) {
  try {
    const { itemId } = req.params
    const sellerId = req.userData.id
    const updateData = req.body
    const imageUrls = req.files ? req.files.map(file => file.location) : []

    const sellItem = await updateSellItemService(itemId, sellerId, updateData, imageUrls)
    res.status(200).send({
      status: 'success',
      message: 'Sell item updated successfully',
      data: sellItem
    })
  } catch (error) {
    next(error)
  }
}

async function deleteSellItem(req, res, next) {
  try {
    const { itemId } = req.params
    const sellerId = req.userData.id

    const result = await deleteSellItemService(itemId, sellerId)
    res.status(200).send({
      status: 'success',
      message: result.message
    })
  } catch (error) {
    next(error)
  }
}

async function getSellItemsBySeller(req, res, next) {
  try {
    const { sellerId } = req.params
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    const result = await getSellItemsBySellerService(sellerId, page, limit)
    res.status(200).send({
      status: 'success',
      message: 'Sell items retrieved successfully',
      data: result.sellItems,
      pagination: result.pagination
    })
  } catch (error) {
    next(error)
  }
}

export {
  createSellItem,
  getAllSellItems,
  getSellItemById,
  updateSellItem,
  deleteSellItem,
  getSellItemsBySeller
}
