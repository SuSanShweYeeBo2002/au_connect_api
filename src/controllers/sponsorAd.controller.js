import {
  createSponsorAd as createSponsorAdService,
  getAllSponsorAds as getAllSponsorAdsService,
  getActiveSponsorAds as getActiveSponsorAdsService,
  getSponsorAdById as getSponsorAdByIdService,
  updateSponsorAd as updateSponsorAdService,
  deleteSponsorAd as deleteSponsorAdService,
  incrementClickCount as incrementClickCountService,
  incrementImpressionCount as incrementImpressionCountService
} from '../services/sponsorAd.service.js'

async function createSponsorAd(req, res, next) {
  try {
    const { title, sponsorName, link, description, startDate, endDate, status } = req.body
    const adminId = req.userData.id
    
    if (!req.file) {
      const err = new Error()
      err.message = 'Sponsor ad image is required'
      err.status = 400
      return next(err)
    }
    
    const imageUrl = req.file.location
    
    const adData = {
      title,
      sponsorName,
      link,
      description,
      startDate,
      endDate,
      status: status || 'pending'
    }
    
    const sponsorAd = await createSponsorAdService(adminId, adData, imageUrl)
    
    res.status(201).send({
      status: 'success',
      message: 'Sponsor ad created successfully',
      data: sponsorAd
    })
  } catch (error) {
    next(error)
  }
}

async function getAllSponsorAds(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const status = req.query.status || null
    
    const result = await getAllSponsorAdsService(page, limit, status)
    
    res.status(200).send({
      status: 'success',
      message: 'Sponsor ads retrieved successfully',
      data: result.ads,
      pagination: result.pagination
    })
  } catch (error) {
    next(error)
  }
}

async function getActiveSponsorAds(req, res, next) {
  try {
    const ads = await getActiveSponsorAdsService()
    
    res.status(200).send({
      status: 'success',
      message: 'Active sponsor ads retrieved successfully',
      data: ads
    })
  } catch (error) {
    next(error)
  }
}

async function getSponsorAdById(req, res, next) {
  try {
    const { adId } = req.params
    const ad = await getSponsorAdByIdService(adId)
    
    res.status(200).send({
      status: 'success',
      message: 'Sponsor ad retrieved successfully',
      data: ad
    })
  } catch (error) {
    next(error)
  }
}

async function updateSponsorAd(req, res, next) {
  try {
    const { adId } = req.params
    const updateData = req.body
    const newImageUrl = req.file ? req.file.location : null
    
    const ad = await updateSponsorAdService(adId, updateData, newImageUrl)
    
    res.status(200).send({
      status: 'success',
      message: 'Sponsor ad updated successfully',
      data: ad
    })
  } catch (error) {
    next(error)
  }
}

async function deleteSponsorAd(req, res, next) {
  try {
    const { adId } = req.params
    const result = await deleteSponsorAdService(adId)
    
    res.status(200).send({
      status: 'success',
      message: result.message
    })
  } catch (error) {
    next(error)
  }
}

async function trackClick(req, res, next) {
  try {
    const { adId } = req.params
    await incrementClickCountService(adId)
    
    res.status(200).send({
      status: 'success',
      message: 'Click tracked successfully'
    })
  } catch (error) {
    next(error)
  }
}

async function trackImpression(req, res, next) {
  try {
    const { adId } = req.params
    await incrementImpressionCountService(adId)
    
    res.status(200).send({
      status: 'success',
      message: 'Impression tracked successfully'
    })
  } catch (error) {
    next(error)
  }
}

export {
  createSponsorAd,
  getAllSponsorAds,
  getActiveSponsorAds,
  getSponsorAdById,
  updateSponsorAd,
  deleteSponsorAd,
  trackClick,
  trackImpression
}
