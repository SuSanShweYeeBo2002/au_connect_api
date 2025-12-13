import {
  signupService,
  signinService,
  getUserListService,
  getUserByIdService,
  getCurrentUserService,
  updateUserService
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

export { signup, signin, getUserList, getUserById, getCurrentUser, updateUser }
