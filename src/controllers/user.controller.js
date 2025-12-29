import {
  signupService,
  signinService,
  getUserListService,
  getUserByIdService,
  getCurrentUserService,
  updateUserService,
  uploadProfileImageService,
  deleteProfileImageService,
  verifyEmailService,
  resendVerificationEmailService
} from '../services/user.service.js'

async function signup (req, res, next) {
  try {
    const { email, password } = req.body

    const user = await signupService({
      email,
      password
    })
    res.status(200).send(user)
  } catch (error) {
    next(error)
  }
}

async function signin (req, res, next) {
  try {
    const { email, password } = req.body

    const user = await signinService({
      email,
      password
    })
    res.status(200).send(user)
  } catch (error) {
    next(error)
  }
}

async function getUserList(req, res, next) {
  try {
    const currentUserId = req.userData.id
    const users = await getUserListService(currentUserId)
    
    res.status(200).send({
      status: 'success',
      message: 'Users retrieved successfully',
      data: users
    })
  } catch (error) {
    next(error)
  }
}

async function getUserById(req, res, next) {
  try {
    const { userId } = req.params
    const user = await getUserByIdService(userId)
    
    res.status(200).send({
      status: 'success',
      message: 'User retrieved successfully',
      data: user
    })
  } catch (error) {
    next(error)
  }
}

async function getCurrentUser(req, res, next) {
  try {
    const userId = req.userData.id
    const user = await getCurrentUserService(userId)
    
    res.status(200).send({
      status: 'success',
      message: 'User profile retrieved successfully',
      data: user
    })
  } catch (error) {
    next(error)
  }
}

async function updateUser(req, res, next) {
  try {
    const userId = req.userData.id
    const updateData = req.body
    
    const user = await updateUserService(userId, updateData)
    
    res.status(200).send({
      status: 'success',
      message: 'User updated successfully',
      data: user
    })
  } catch (error) {
    next(error)
  }
}

async function uploadProfileImage(req, res, next) {
  try {
    const userId = req.userData.id
    
    if (!req.file) {
      const err = new Error()
      err.message = 'No image file provided'
      err.status = 400
      throw err
    }

    const imageUrl = req.file.location // S3 URL
    const user = await uploadProfileImageService(userId, imageUrl)
    
    res.status(200).send({
      status: 'success',
      message: 'Profile image uploaded successfully',
      data: user
    })
  } catch (error) {
    next(error)
  }
}

async function deleteProfileImage(req, res, next) {
  try {
    const userId = req.userData.id
    const user = await deleteProfileImageService(userId)
    
    res.status(200).send({
      status: 'success',
      message: 'Profile image deleted successfully',
      data: user
    })
  } catch (error) {
    next(error)
  }
}

async function verifyEmail(req, res, next) {
  try {
    const { token } = req.query
    
    if (!token) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verification Error - AU Connect</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
            }
            .container {
              background: white;
              border-radius: 20px;
              padding: 40px;
              max-width: 500px;
              width: 100%;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
              text-align: center;
            }
            .error-icon {
              width: 80px;
              height: 80px;
              background: #ff4757;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 20px;
              font-size: 40px;
              color: white;
            }
            h1 { color: #2c3e50; margin-bottom: 10px; font-size: 28px; }
            p { color: #7f8c8d; line-height: 1.6; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="error-icon">✕</div>
            <h1>Verification Failed</h1>
            <p>Invalid verification link. Please check your email and try again.</p>
          </div>
        </body>
        </html>
      `)
    }

    const result = await verifyEmailService(token)
    
    // Send beautiful HTML success page
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verified - AU Connect</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          .container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 500px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            text-align: center;
            animation: slideUp 0.5s ease;
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .success-icon {
            width: 80px;
            height: 80px;
            background: #4CAF50;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            animation: scaleIn 0.5s ease 0.2s both;
          }
          @keyframes scaleIn {
            from { transform: scale(0); }
            to { transform: scale(1); }
          }
          .checkmark {
            width: 40px;
            height: 40px;
            border: 4px solid white;
            border-radius: 50%;
            position: relative;
          }
          .checkmark:after {
            content: '';
            position: absolute;
            left: 8px;
            top: 3px;
            width: 12px;
            height: 20px;
            border: solid white;
            border-width: 0 4px 4px 0;
            transform: rotate(45deg);
          }
          h1 { 
            color: #2c3e50; 
            margin-bottom: 10px; 
            font-size: 28px;
          }
          p { 
            color: #7f8c8d; 
            line-height: 1.6; 
            margin-bottom: 20px;
            font-size: 16px;
          }
          .btn {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 40px;
            border-radius: 30px;
            text-decoration: none;
            font-weight: 600;
            font-size: 16px;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            margin: 10px;
          }
          .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
          }
          .instruction {
            background: #f8f9fa;
            border-left: 4px solid #4CAF50;
            padding: 15px;
            margin: 20px 0;
            text-align: left;
            border-radius: 5px;
          }
          .instruction ol {
            margin-left: 20px;
            color: #555;
          }
          .instruction li {
            margin: 8px 0;
          }
          #mobileBtn { display: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="success-icon">
            <div class="checkmark"></div>
          </div>
          <h1>Email Verified! 🎉</h1>
          <p>Your email has been successfully verified.</p>
          
          <div class="instruction">
            <strong>Next Steps:</strong>
            <ol>
              <li>Close this browser window</li>
              <li>Open the AU Connect app</li>
              <li>Sign in with your verified email</li>
            </ol>
          </div>
          
          <a href="auconnect://signin" class="btn" id="mobileBtn">Open AU Connect App</a>
        </div>
        
        <script>
          // Detect if mobile device
          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
          
          if (isMobile) {
            // Show "Open App" button for mobile
            document.getElementById('mobileBtn').style.display = 'inline-block';
            
            // Try to open app automatically (only works if app is installed)
            setTimeout(() => {
              window.location.href = 'auconnect://signin';
            }, 1500);
          }
        </script>
      </body>
      </html>
    `)
  } catch (error) {
    // Error page
    res.status(error.status || 500).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Error - AU Connect</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          .container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 500px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            text-align: center;
          }
          .error-icon {
            width: 80px;
            height: 80px;
            background: #ff4757;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 40px;
            color: white;
          }
          h1 { color: #2c3e50; margin-bottom: 10px; font-size: 28px; }
          p { color: #7f8c8d; line-height: 1.6; margin-bottom: 20px; }
          .btn {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 40px;
            border-radius: 30px;
            text-decoration: none;
            font-weight: 600;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="error-icon">✕</div>
          <h1>Verification Failed</h1>
          <p>${error.message || 'Something went wrong. Please try again.'}</p>
          <a href="auconnect://signup" class="btn">Back to App</a>
        </div>
      </body>
      </html>
    `)
  }
}

async function resendVerificationEmail(req, res, next) {
  try {
    const { email } = req.body
    
    if (!email) {
      const err = new Error()
      err.message = 'Email is required'
      err.status = 400
      throw err
    }

    const result = await resendVerificationEmailService(email)
    
    res.status(200).send({
      status: 'success',
      message: result.message
    })
  } catch (error) {
    next(error)
  }
}

export { 
  signup, 
  signin, 
  getUserList, 
  getUserById, 
  getCurrentUser, 
  updateUser,
  uploadProfileImage,
  deleteProfileImage,
  verifyEmail,
  resendVerificationEmail
}
