import SponsorAd from '../models/sponsorAd.js'
import { deleteFromS3 } from '../utils/s3.js'

async function createSponsorAd(adminId, adData, imageUrl) {
  try {
    const sponsorAd = await new SponsorAd({
      ...adData,
      image: imageUrl,
      createdBy: adminId
    }).save()
    
    return sponsorAd.populate('createdBy', 'email displayName')
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function getAllSponsorAds(page = 1, limit = 10, status = null) {
  try {
    const skip = (page - 1) * limit
    
    // Build query
    let query = {}
    if (status) {
      query.status = status
    }
    
    const ads = await SponsorAd.find(query)
      .populate('createdBy', 'email displayName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
    
    const totalAds = await SponsorAd.countDocuments(query)
    
    return {
      ads,
      pagination: {
        page,
        limit,
        totalAds,
        totalPages: Math.ceil(totalAds / limit),
        hasNextPage: page * limit < totalAds,
        hasPrevPage: page > 1
      }
    }
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function getActiveSponsorAds() {
  try {
    const currentDate = new Date()
    
    // Get ads that are active and within their date range
    const ads = await SponsorAd.find({
      status: 'active',
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate }
    })
      .select('-createdBy -__v')
      .sort({ createdAt: -1 })
    
    return ads
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function getSponsorAdById(adId) {
  try {
    const ad = await SponsorAd.findById(adId).populate('createdBy', 'email displayName')
    
    if (!ad) {
      const err = new Error()
      err.message = 'Sponsor ad not found'
      err.status = 404
      throw err
    }
    
    return ad
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function updateSponsorAd(adId, updateData, newImageUrl = null) {
  try {
    const ad = await SponsorAd.findById(adId)
    
    if (!ad) {
      const err = new Error()
      err.message = 'Sponsor ad not found'
      err.status = 404
      throw err
    }
    
    // If new image is uploaded, delete the old one
    if (newImageUrl && ad.image) {
      try {
        await deleteFromS3(ad.image)
      } catch (deleteError) {
        console.error('Error deleting old image:', deleteError)
        // Continue even if deletion fails
      }
      updateData.image = newImageUrl
    }
    
    // Update the ad
    Object.assign(ad, updateData)
    await ad.save()
    
    return ad.populate('createdBy', 'email displayName')
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function deleteSponsorAd(adId) {
  try {
    const ad = await SponsorAd.findById(adId)
    
    if (!ad) {
      const err = new Error()
      err.message = 'Sponsor ad not found'
      err.status = 404
      throw err
    }
    
    // Delete image from S3
    if (ad.image) {
      try {
        await deleteFromS3(ad.image)
      } catch (deleteError) {
        console.error('Error deleting image:', deleteError)
        // Continue even if deletion fails
      }
    }
    
    await SponsorAd.findByIdAndDelete(adId)
    
    return { message: 'Sponsor ad deleted successfully' }
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function incrementClickCount(adId) {
  try {
    const ad = await SponsorAd.findByIdAndUpdate(
      adId,
      { $inc: { clickCount: 1 } },
      { new: true }
    )
    
    if (!ad) {
      const err = new Error()
      err.message = 'Sponsor ad not found'
      err.status = 404
      throw err
    }
    
    return ad
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function incrementImpressionCount(adId) {
  try {
    const ad = await SponsorAd.findByIdAndUpdate(
      adId,
      { $inc: { impressionCount: 1 } },
      { new: true }
    )
    
    if (!ad) {
      const err = new Error()
      err.message = 'Sponsor ad not found'
      err.status = 404
      throw err
    }
    
    return ad
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

// Auto-expire ads that are past their end date
async function autoExpireAds() {
  try {
    const currentDate = new Date()
    
    const result = await SponsorAd.updateMany(
      {
        status: 'active',
        endDate: { $lt: currentDate }
      },
      {
        $set: { status: 'expired' }
      }
    )
    
    return result
  } catch (error) {
    console.error('Error auto-expiring ads:', error)
    throw error
  }
}

export {
  createSponsorAd,
  getAllSponsorAds,
  getActiveSponsorAds,
  getSponsorAdById,
  updateSponsorAd,
  deleteSponsorAd,
  incrementClickCount,
  incrementImpressionCount,
  autoExpireAds
}
