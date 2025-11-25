import {
  blockUserService,
  unblockUserService,
  getBlockedUsersService,
  getWhoBlockedMeService
} from '../services/block.service.js'

async function blockUser(req, res, next) {
  try {
    const blockerId = req.userData.id
    const { blockedId } = req.body

    const result = await blockUserService({
      blockerId,
      blockedId
    })

    res.status(200).send(result)
  } catch (error) {
    next(error)
  }
}

async function unblockUser(req, res, next) {
  try {
    const blockerId = req.userData.id
    const { blockedId } = req.params

    const result = await unblockUserService({
      blockerId,
      blockedId
    })

    res.status(200).send(result)
  } catch (error) {
    next(error)
  }
}

async function getBlockedUsers(req, res, next) {
  try {
    const blockerId = req.userData.id
    const result = await getBlockedUsersService(blockerId)
    
    res.status(200).send(result)
  } catch (error) {
    next(error)
  }
}

async function getWhoBlockedMe(req, res, next) {
  try {
    const userId = req.userData.id
    const result = await getWhoBlockedMeService(userId)
    
    res.status(200).send(result)
  } catch (error) {
    next(error)
  }
}

export {
  blockUser,
  unblockUser,
  getBlockedUsers,
  getWhoBlockedMe
}
