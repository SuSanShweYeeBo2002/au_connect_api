import Block from '../models/block.js'
import User from '../models/user.js'
import Friend from '../models/friend.js'

async function blockUserService({ blockerId, blockedId }) {
  try {
    // Check if blocked user exists
    const blockedUser = await User.findById(blockedId)
    if (!blockedUser) {
      const err = new Error()
      err.message = 'User not found.'
      err.status = 404
      throw err
    }

    // Check if trying to block self
    if (blockerId === blockedId) {
      const err = new Error()
      err.message = 'Cannot block yourself.'
      err.status = 400
      throw err
    }

    // Check if already blocked
    const existingBlock = await Block.findOne({ blockerId, blockedId })
    if (existingBlock) {
      const err = new Error()
      err.message = 'User is already blocked.'
      err.status = 400
      throw err
    }

    // Create block
    const block = await new Block({
      blockerId,
      blockedId
    }).save()

    // Remove any existing friendship
    await Friend.deleteMany({
      $or: [
        { requesterId: blockerId, recipientId: blockedId },
        { requesterId: blockedId, recipientId: blockerId }
      ]
    })

    return {
      status: 'success',
      message: 'User blocked successfully.',
      data: block
    }
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function unblockUserService({ blockerId, blockedId }) {
  try {
    // Find and delete the block
    const block = await Block.findOneAndDelete({ blockerId, blockedId })

    if (!block) {
      const err = new Error()
      err.message = 'Block not found.'
      err.status = 404
      throw err
    }

    return {
      status: 'success',
      message: 'User unblocked successfully.'
    }
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function getBlockedUsersService(blockerId) {
  try {
    const blocks = await Block.find({ blockerId })
      .populate('blockedId', 'email')
      .sort({ createdAt: -1 })

    const blockedUsers = blocks.map(block => ({
      _id: block._id,
      user: block.blockedId,
      blockedAt: block.createdAt
    }))

    return {
      status: 'success',
      message: 'Blocked users retrieved successfully.',
      data: blockedUsers
    }
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function checkIfBlockedService(user1Id, user2Id) {
  try {
    // Check if either user has blocked the other
    const block = await Block.findOne({
      $or: [
        { blockerId: user1Id, blockedId: user2Id },
        { blockerId: user2Id, blockedId: user1Id }
      ]
    })

    return !!block
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function getBlockedUserIdsService(userId) {
  try {
    // Get all users blocked by this user
    const blocks = await Block.find({ blockerId: userId }).select('blockedId')
    return blocks.map(block => block.blockedId.toString())
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function getUsersWhoBlockedMeService(userId) {
  try {
    // Get all users who blocked this user
    const blocks = await Block.find({ blockedId: userId }).select('blockerId')
    return blocks.map(block => block.blockerId.toString())
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function getWhoBlockedMeService(userId) {
  try {
    const blocks = await Block.find({ blockedId: userId })
      .populate('blockerId', 'email')
      .sort({ createdAt: -1 })

    const usersWhoBlockedMe = blocks.map(block => ({
      _id: block._id,
      user: block.blockerId,
      blockedAt: block.createdAt
    }))

    return {
      status: 'success',
      message: 'Users who blocked you retrieved successfully.',
      data: usersWhoBlockedMe
    }
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

export {
  blockUserService,
  unblockUserService,
  getBlockedUsersService,
  checkIfBlockedService,
  getBlockedUserIdsService,
  getUsersWhoBlockedMeService,
  getWhoBlockedMeService
}
