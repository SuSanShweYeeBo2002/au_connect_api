import {
  signupService,
  signinService,
  getUserListService
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

export { signup, signin, getUserList }
