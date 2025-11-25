import {
  sendFriendRequestService,
  getPendingRequestsService,
  getSentRequestsService,
  respondFriendRequestService,
  getFriendsListService,
  unfriendService,
  cancelFriendRequestService
} from '../services/friend.service.js'

async function sendFriendRequest(req, res, next) {
  try {
    const requesterId = req.userData.id
    const { recipientId } = req.body

    const result = await sendFriendRequestService({
      requesterId,
      recipientId
    })

    res.status(200).send(result)
  } catch (error) {
    next(error)
  }
}

async function getPendingRequests(req, res, next) {
  try {
    const userId = req.userData.id
    const result = await getPendingRequestsService(userId)
    
    res.status(200).send(result)
  } catch (error) {
    next(error)
  }
}

async function getSentRequests(req, res, next) {
  try {
    const userId = req.userData.id
    const result = await getSentRequestsService(userId)
    
    res.status(200).send(result)
  } catch (error) {
    next(error)
  }
}

async function respondFriendRequest(req, res, next) {
  try {
    const userId = req.userData.id
    const { requestId } = req.params
    const { status } = req.body

    const result = await respondFriendRequestService({
      requestId,
      userId,
      status
    })

    res.status(200).send(result)
  } catch (error) {
    next(error)
  }
}

async function getFriendsList(req, res, next) {
  try {
    const userId = req.userData.id
    const result = await getFriendsListService(userId)
    
    res.status(200).send(result)
  } catch (error) {
    next(error)
  }
}

async function unfriend(req, res, next) {
  try {
    const userId = req.userData.id
    const { friendId } = req.params

    const result = await unfriendService({
      friendId,
      userId
    })

    res.status(200).send(result)
  } catch (error) {
    next(error)
  }
}

async function cancelFriendRequest(req, res, next) {
  try {
    const userId = req.userData.id
    const { requestId } = req.params

    const result = await cancelFriendRequestService({
      requestId,
      userId
    })

    res.status(200).send(result)
  } catch (error) {
    next(error)
  }
}

export {
  sendFriendRequest,
  getPendingRequests,
  getSentRequests,
  respondFriendRequest,
  getFriendsList,
  unfriend,
  cancelFriendRequest
}
