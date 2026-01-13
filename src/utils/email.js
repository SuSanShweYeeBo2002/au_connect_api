import sgMail from '@sendgrid/mail'
import config from '../config/index.js'

// Configure SendGrid
if (!config.email.sendGridApiKey) {
  console.error('❌ ERROR: SENDGRID_API_KEY is not configured!')
  console.error('Please set SENDGRID_API_KEY in your environment variables')
} else {
  sgMail.setApiKey(config.email.sendGridApiKey)
  console.log('=== Email Configuration ===')
  console.log('Provider: SendGrid')
  console.log('SendGrid API Key: Configured ✓')
  console.log('From:', config.email.from)
  console.log('App URL:', config.appUrl)
  console.log('==========================')
}

export async function sendVerificationEmail(email, verificationToken) {
  try {
    console.log('\n📧 Sending verification email via SendGrid...')
    console.log('To:', email)
    console.log('Token:', verificationToken)
    
    const verificationUrl = `${config.appUrl}/users/verify-email?token=${verificationToken}`
    console.log('Verification URL:', verificationUrl)
    
    const msg = {
      to: email,
      from: config.email.from,
      subject: 'Verify Your Email - AU Connect',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .button { 
              display: inline-block; 
              padding: 12px 24px; 
              background-color: #4CAF50; 
              color: white; 
              text-decoration: none; 
              border-radius: 4px; 
              margin: 20px 0;
            }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to AU Connect!</h1>
            </div>
            <div class="content">
              <h2>Verify Your Email Address</h2>
              <p>Thank you for signing up! Please click the button below to verify your email address:</p>
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email</a>
              </div>
              <p>Or copy and paste this link in your browser:</p>
              <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
              <p><strong>Note:</strong> This link will expire in 24 hours.</p>
            </div>
            <div class="footer">
              <p>If you didn't create an account, please ignore this email.</p>
              <p>&copy; 2026 AU Connect. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    }

    console.log('Sending to:', msg.to)
    
    const response = await sgMail.send(msg)
    console.log('✅ Email sent successfully via SendGrid!')
    console.log('Status:', response[0].statusCode)
    
    return { success: true }
  } catch (error) {
    console.error('\n❌ ERROR sending verification email:')
    console.error('Error:', error.message)
    if (error.response) {
      console.error('SendGrid response:', error.response.body)
    }
    console.error('Full error:', error)
    throw error
  }
}

export function validateEmailDomain(email) {
  const domain = email.split('@')[1]
  return config.allowedEmailDomains.includes(domain)
}

export function generateVerificationToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}
