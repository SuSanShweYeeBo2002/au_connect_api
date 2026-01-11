import LostItem from '../models/lostItem.js'

async function createLostItem(reporterId, itemData, imageUrls) {
  try {
    const lostItem = await new LostItem({
      reporter: reporterId,
      ...itemData,
      ...(imageUrls && imageUrls.length > 0 && { images: imageUrls })
    }).save()
    
    return lostItem.populate('reporter', 'email displayName profileImage')
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status
    throw err
  }
}

async function getAllLostItems(page = 1, limit = 10, filters = {}) {
  try {
    const skip = (page - 1) * limit
    
    // Build query based on filters
    const query = {}
    
    if (filters.category) {
      query.category = filters.category
    }
    
    if (filters.type) {
      query.type = filters.type
    }
    
    if (filters.status) {
      query.status = filters.status
    }
    
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
        { location: { $regex: filters.search, $options: 'i' } }
      ]
    }
    
    const lostItems = await LostItem.find(query)
      .populate('reporter', 'email displayName profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
    
    const totalItems = await LostItem.countDocuments(query)
    
    return {
      lostItems,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        hasNext: page < Math.ceil(totalItems / limit),
        hasPrev: page > 1
      }
    }
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status
    throw err
  }
}

async function getLostItemById(itemId) {
  try {
    const lostItem = await LostItem.findById(itemId)
      .populate('reporter', 'email displayName profileImage')
    
    if (!lostItem) {
      const err = new Error()
      err.message = 'Lost item not found'
      err.status = 404
      throw err
    }
    
    return lostItem
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function updateLostItem(itemId, reporterId, updateData, imageUrls) {
  try {
    const lostItem = await LostItem.findById(itemId)
    
    if (!lostItem) {
      const err = new Error()
      err.message = 'Lost item not found'
      err.status = 404
      throw err
    }
    
    // Check if the user is the reporter
    if (lostItem.reporter.toString() !== reporterId) {
      const err = new Error()
      err.message = 'Unauthorized to update this item'
      err.status = 403
      throw err
    }
    
    // Handle images update
    if (updateData.images !== undefined || imageUrls.length > 0) {
      // If images array is sent in body (existing images to keep)
      const existingImagesToKeep = Array.isArray(updateData.images) ? updateData.images : []
      // Combine kept images with new uploaded images
      lostItem.images = [...existingImagesToKeep, ...imageUrls]
      // Remove images field from updateData to avoid overwriting
      delete updateData.images
    }
    
    // Update other fields
    Object.assign(lostItem, updateData)
    await lostItem.save()
    
    return lostItem.populate('reporter', 'email displayName profileImage')
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function deleteLostItem(itemId, reporterId) {
  try {
    const lostItem = await LostItem.findById(itemId)
    
    if (!lostItem) {
      const err = new Error()
      err.message = 'Lost item not found'
      err.status = 404
      throw err
    }
    
    // Check if the user is the reporter
    if (lostItem.reporter.toString() !== reporterId) {
      const err = new Error()
      err.message = 'Unauthorized to delete this item'
      err.status = 403
      throw err
    }
    
    await LostItem.findByIdAndDelete(itemId)
    
    return { message: 'Lost item deleted successfully' }
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function getLostItemsByReporter(reporterId, page = 1, limit = 10) {
  try {
    const skip = (page - 1) * limit
    
    const lostItems = await LostItem.find({ reporter: reporterId })
      .populate('reporter', 'email displayName profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
    
    const totalItems = await LostItem.countDocuments({ reporter: reporterId })
    
    return {
      lostItems,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        hasNext: page < Math.ceil(totalItems / limit),
        hasPrev: page > 1
      }
    }
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status
    throw err
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
