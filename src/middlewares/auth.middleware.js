import jwt from 'jsonwebtoken'
import User from '../models/user.js'

export const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, 'secret')
    req.userData = decoded
    next()
  } catch (error) {
    const err = new Error()
    err.message = 'Token Expired.'
    err.status = 400
    throw err
  }
}

export const checkAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, 'secret')
    
    // Fetch user from database to check admin status
    const user = await User.findById(decoded.id)
    
    if (!user) {
      const err = new Error()
      err.message = 'User not found.'
      err.status = 404
      return next(err)
    }
    
    if (!user.isAdmin) {
      const err = new Error()
      err.message = 'Access denied. Admin privileges required.'
      err.status = 403
      return next(err)
    }
    
    req.userData = decoded
    next()
  } catch (error) {
    const err = new Error()
    err.message = error.message || 'Authentication failed.'
    err.status = error.status || 401
    next(err)
  }
}
