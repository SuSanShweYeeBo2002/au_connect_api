import express from 'express'
import { checkAuth, checkAdmin } from '../middlewares/auth.middleware.js'
import {
  createSponsorAd,
  getAllSponsorAds,
  getActiveSponsorAds,
  getSponsorAdById,
  updateSponsorAd,
  deleteSponsorAd,
  trackClick,
  trackImpression
} from '../controllers/sponsorAd.controller.js'
import {
  createSponsorAdValidation,
  updateSponsorAdValidation,
  sponsorAdIdValidation,
  paginationValidation
} from '../validations/sponsorAd.validation.js'
import { uploadSponsorAdImage } from '../utils/s3.js'

const router = express.Router()

// Public routes (no auth required)
router.get('/active', getActiveSponsorAds) // Get all active sponsor ads for display
router.post('/:adId/click', sponsorAdIdValidation, trackClick) // Track ad clicks
router.post('/:adId/impression', sponsorAdIdValidation, trackImpression) // Track ad impressions

// Admin routes (authentication + admin privileges required)
router.post('/', checkAdmin, uploadSponsorAdImage.single('image'), createSponsorAdValidation, createSponsorAd)
router.get('/', checkAdmin, paginationValidation, getAllSponsorAds) // Get all ads with pagination
router.get('/:adId', checkAdmin, sponsorAdIdValidation, getSponsorAdById) // Get specific ad by ID
router.put('/:adId', checkAdmin, sponsorAdIdValidation, uploadSponsorAdImage.single('image'), updateSponsorAdValidation, updateSponsorAd)
router.delete('/:adId', checkAdmin, sponsorAdIdValidation, deleteSponsorAd)

export default app => {
  app.use('/sponsor-ads', router)
}
