import SellItem from '../models/sellItem.js'

async function createSellItem(sellerId, itemData, imageUrls) {
  try {
    const sellItem = await new SellItem({
      seller: sellerId,
      ...itemData,
      ...(imageUrls && imageUrls.length > 0 && { images: imageUrls })
    }).save()
    
    return sellItem.populate('seller', 'email')
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status
    throw err
  }
}

async function getAllSellItems(page = 1, limit = 10, filters = {}) {
  try {
    const skip = (page - 1) * limit
    
    // Build query based on filters
    const query = {}
    
    if (filters.category) {
      query.category = filters.category
    }
    
    if (filters.status) {
      query.status = filters.status
    }
    
    if (filters.condition) {
      query.condition = filters.condition
    }
    
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.price = {}
      if (filters.minPrice !== undefined) {
        query.price.$gte = filters.minPrice
      }
      if (filters.maxPrice !== undefined) {
        query.price.$lte = filters.maxPrice
      }
    }
    
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } }
      ]
    }
    
    const sellItems = await SellItem.find(query)
      .populate('seller', 'email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
    
    const totalItems = await SellItem.countDocuments(query)
    
    return {
      sellItems,
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

async function getSellItemById(itemId) {
  try {
    const sellItem = await SellItem.findById(itemId)
      .populate('seller', 'email')
    
    if (!sellItem) {
      const err = new Error()
      err.message = 'Sell item not found'
      err.status = 404
      throw err
    }
    
    return sellItem
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function updateSellItem(itemId, sellerId, updateData, imageUrls) {
  try {
    const sellItem = await SellItem.findById(itemId)
    
    if (!sellItem) {
      const err = new Error()
      err.message = 'Sell item not found'
      err.status = 404
      throw err
    }
    
    // Check if the user is the seller
    if (sellItem.seller.toString() !== sellerId) {
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
      sellItem.images = [...existingImagesToKeep, ...imageUrls]
      // Remove images field from updateData to avoid overwriting
      delete updateData.images
    }
    
    // Update other fields
    Object.assign(sellItem, updateData)
    await sellItem.save()
    
    return sellItem.populate('seller', 'email')
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function deleteSellItem(itemId, sellerId) {
  try {
    const sellItem = await SellItem.findById(itemId)
    
    if (!sellItem) {
      const err = new Error()
      err.message = 'Sell item not found'
      err.status = 404
      throw err
    }
    
    // Check if the user is the seller
    if (sellItem.seller.toString() !== sellerId) {
      const err = new Error()
      err.message = 'Unauthorized to delete this item'
      err.status = 403
      throw err
    }
    
    await SellItem.findByIdAndDelete(itemId)
    
    return { message: 'Sell item deleted successfully' }
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function getSellItemsBySeller(sellerId, page = 1, limit = 10) {
  try {
    const skip = (page - 1) * limit
    
    const sellItems = await SellItem.find({ seller: sellerId })
      .populate('seller', 'email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
    
    const totalItems = await SellItem.countDocuments({ seller: sellerId })
    
    return {
      sellItems,
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
  createSellItem,
  getAllSellItems,
  getSellItemById,
  updateSellItem,
  deleteSellItem,
  getSellItemsBySeller
}
