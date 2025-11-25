import Friend from '../models/friend.js'
import User from '../models/user.js'

async function sendFriendRequestService({ requesterId, recipientId }) {
  try {
    // Check if recipient exists
    const recipient = await User.findById(recipientId)
    if (!recipient) {
      const err = new Error()
      err.message = 'User not found.'
      err.status = 404
      throw err
    }

    // Check if trying to send request to self
    if (requesterId === recipientId) {
      const err = new Error()
      err.message = 'Cannot send friend request to yourself.'
      err.status = 400
      throw err
    }

    // Check if friend request already exists (in either direction)
    const existingRequest = await Friend.findOne({
      $or: [
        { requesterId, recipientId },
        { requesterId: recipientId, recipientId: requesterId }
      ]
    })

    if (existingRequest) {
      if (existingRequest.status === 'pending') {
        const err = new Error()
        err.message = 'Friend request already exists.'
        err.status = 400
        throw err
      } else if (existingRequest.status === 'accepted') {
        const err = new Error()
        err.message = 'You are already friends.'
        err.status = 400
        throw err
      } else if (existingRequest.status === 'rejected') {
        // Allow resending if previously rejected
        existingRequest.status = 'pending'
        existingRequest.requesterId = requesterId
        existingRequest.recipientId = recipientId
        await existingRequest.save()
        return {
          status: 'success',
          message: 'Friend request sent successfully.',
          data: existingRequest
        }
      }
    }

    // Create new friend request
    const friendRequest = await new Friend({
      requesterId,
      recipientId,
      status: 'pending'
    }).save()

    return {
      status: 'success',
      message: 'Friend request sent successfully.',
      data: friendRequest
    }
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function getPendingRequestsService(userId) {
  try {
    // Get friend requests received by the user (where user is recipient)
    const pendingRequests = await Friend.find({
      recipientId: userId,
      status: 'pending'
    })
      .populate('requesterId', 'email')
      .sort({ createdAt: -1 })

    return {
      status: 'success',
      message: 'Pending friend requests retrieved successfully.',
      data: pendingRequests
    }
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function getSentRequestsService(userId) {
  try {
    // Get friend requests sent by the user (where user is requester)
    const sentRequests = await Friend.find({
      requesterId: userId,
      status: 'pending'
    })
      .populate('recipientId', 'email')
      .sort({ createdAt: -1 })

    return {
      status: 'success',
      message: 'Sent friend requests retrieved successfully.',
      data: sentRequests
    }
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function respondFriendRequestService({ requestId, userId, status }) {
  try {
    // Find the friend request
    const friendRequest = await Friend.findById(requestId)

    if (!friendRequest) {
      const err = new Error()
      err.message = 'Friend request not found.'
      err.status = 404
      throw err
    }

    // Check if the user is the recipient
    if (friendRequest.recipientId.toString() !== userId) {
      const err = new Error()
      err.message = 'You are not authorized to respond to this request.'
      err.status = 403
      throw err
    }

    // Check if request is still pending
    if (friendRequest.status !== 'pending') {
      const err = new Error()
      err.message = `Friend request has already been ${friendRequest.status}.`
      err.status = 400
      throw err
    }

    // Update the status
    friendRequest.status = status
    await friendRequest.save()

    return {
      status: 'success',
      message: `Friend request ${status} successfully.`,
      data: friendRequest
    }
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function getFriendsListService(userId) {
  try {
    // Get all accepted friend requests where user is either requester or recipient
    const friends = await Friend.find({
      $or: [{ requesterId: userId }, { recipientId: userId }],
      status: 'accepted'
    })
      .populate('requesterId', 'email')
      .populate('recipientId', 'email')
      .sort({ updatedAt: -1 })

    // Format the response to show the friend (not the current user)
    const friendsList = friends.map(friend => {
      const isRequester = friend.requesterId._id.toString() === userId
      return {
        _id: friend._id,
        friend: isRequester ? friend.recipientId : friend.requesterId,
        friendsSince: friend.updatedAt
      }
    })

    return {
      status: 'success',
      message: 'Friends list retrieved successfully.',
      data: friendsList
    }
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function unfriendService({ friendId, userId }) {
  try {
    // Find the friendship (could be in either direction)
    const friendship = await Friend.findOne({
      $or: [
        { requesterId: userId, recipientId: friendId },
        { requesterId: friendId, recipientId: userId }
      ],
      status: 'accepted'
    })

    if (!friendship) {
      const err = new Error()
      err.message = 'Friendship not found.'
      err.status = 404
      throw err
    }

    // Delete the friendship
    await Friend.findByIdAndDelete(friendship._id)

    return {
      status: 'success',
      message: 'Unfriended successfully.'
    }
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

async function cancelFriendRequestService({ requestId, userId }) {
  try {
    // Find the friend request
    const friendRequest = await Friend.findById(requestId)

    if (!friendRequest) {
      const err = new Error()
      err.message = 'Friend request not found.'
      err.status = 404
      throw err
    }

    // Check if the user is the requester
    if (friendRequest.requesterId.toString() !== userId) {
      const err = new Error()
      err.message = 'You are not authorized to cancel this request.'
      err.status = 403
      throw err
    }

    // Check if request is still pending
    if (friendRequest.status !== 'pending') {
      const err = new Error()
      err.message = `Cannot cancel a ${friendRequest.status} friend request.`
      err.status = 400
      throw err
    }

    // Delete the friend request
    await Friend.findByIdAndDelete(requestId)

    return {
      status: 'success',
      message: 'Friend request cancelled successfully.'
    }
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

export {
  sendFriendRequestService,
  getPendingRequestsService,
  getSentRequestsService,
  respondFriendRequestService,
  getFriendsListService,
  unfriendService,
  cancelFriendRequestService
}
