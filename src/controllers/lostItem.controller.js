import {
  createLostItem as createLostItemService,
  getAllLostItems as getAllLostItemsService,
  getLostItemById as getLostItemByIdService,
  updateLostItem as updateLostItemService,
  deleteLostItem as deleteLostItemService,
  getLostItemsByReporter as getLostItemsByReporterService
} from '../services/lostItem.service.js'

async function createLostItem(req, res, next) {
  try {
    const reporterId = req.userData.id
    const itemData = req.body

    const lostItem = await createLostItemService(reporterId, itemData)
    res.status(201).send({
      status: 'success',
      message: 'Lost item created successfully',
      data: lostItem
    })
  } catch (error) {
    next(error)
  }
}

async function getAllLostItems(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    
    // Build filters from query params
    const filters = {}
    if (req.query.category) filters.category = req.query.category
    if (req.query.type) filters.type = req.query.type
    if (req.query.status) filters.status = req.query.status
    if (req.query.search) filters.search = req.query.search

    const result = await getAllLostItemsService(page, limit, filters)
    res.status(200).send({
      status: 'success',
      message: 'Lost items retrieved successfully',
      data: result.lostItems,
      pagination: result.pagination
    })
  } catch (error) {
    next(error)
  }
}

async function getLostItemById(req, res, next) {
  try {
    const { itemId } = req.params

    const lostItem = await getLostItemByIdService(itemId)
    res.status(200).send({
      status: 'success',
      message: 'Lost item retrieved successfully',
      data: lostItem
    })
  } catch (error) {
    next(error)
  }
}

async function updateLostItem(req, res, next) {
  try {
    const { itemId } = req.params
    const reporterId = req.userData.id
    const updateData = req.body

    const lostItem = await updateLostItemService(itemId, reporterId, updateData)
    res.status(200).send({
      status: 'success',
      message: 'Lost item updated successfully',
      data: lostItem
    })
  } catch (error) {
    next(error)
  }
}

async function deleteLostItem(req, res, next) {
  try {
    const { itemId } = req.params
    const reporterId = req.userData.id

    const result = await deleteLostItemService(itemId, reporterId)
    res.status(200).send({
      status: 'success',
      message: result.message
    })
  } catch (error) {
    next(error)
  }
}

async function getLostItemsByReporter(req, res, next) {
  try {
    const { reporterId } = req.params
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    const result = await getLostItemsByReporterService(reporterId, page, limit)
    res.status(200).send({
      status: 'success',
      message: 'Lost items retrieved successfully',
      data: result.lostItems,
      pagination: result.pagination
    })
  } catch (error) {
    next(error)
  }
}

export {
  createLostItem,
  getAllLostItems,
  getLostItemById,
  updateLostItem,
  deleteLostItem,
  getLostItemsByReporter
}
