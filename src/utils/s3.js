import { S3Client, DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import multer from 'multer'
import multerS3 from 'multer-s3'
import config from '../config/index.js'
import path from 'path'

// Configure AWS S3 Client
const s3Client = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey
  }
})

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'))
  }
}

// Multer upload configuration for S3
export const uploadToS3 = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: config.aws.s3BucketName,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname })
    },
    key: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const ext = path.extname(file.originalname)
      cb(null, `profile-images/${uniqueSuffix}${ext}`)
    }
  }),
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
})

// Function to delete file from S3
export const deleteFromS3 = async (fileUrl) => {
  try {
    // Extract key from URL
    const url = new URL(fileUrl)
    const key = url.pathname.substring(1) // Remove leading slash
    
    const command = new DeleteObjectCommand({
      Bucket: config.aws.s3BucketName,
      Key: key
    })

    await s3Client.send(command)
    return true
  } catch (error) {
    console.error('Error deleting file from S3:', error)
    throw error
  }
}

export default { uploadToS3, deleteFromS3, s3Client }
