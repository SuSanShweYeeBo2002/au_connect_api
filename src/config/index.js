const env = process.env.NODE_ENV || 'local'

const config = {
  test: {
    port: process.env.PORT || 8383,
    db: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET
  },
  local: {
    port: process.env.PORT || 8383,
    db: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET
  },
  dev: {
    port: process.env.PORT || 8383,
    db: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET
  },
  staging: {
    port: process.env.PORT || 8383,
    db: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET
  },
  production: {
    port: process.env.PORT || 8383,
    db: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET
  }
}

export default {
  ...config[env],
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'ap-southeast-2',
    s3BucketName: process.env.AWS_S3_BUCKET_NAME || 'au-connect-uploads'
  },
  email: {
    sendGridApiKey: process.env.SENDGRID_API_KEY,
    from: process.env.EMAIL_FROM || 'AU Connect <noreply@auconnect.app>'
  },
  allowedEmailDomains: process.env.ALLOWED_EMAIL_DOMAINS 
    ? process.env.ALLOWED_EMAIL_DOMAINS.split(',').map(d => d.trim()) 
    : ['student.university.edu', 'university.edu'], // Default domains - change this!
  appUrl: process.env.APP_URL || 'http://localhost:8383'
}
