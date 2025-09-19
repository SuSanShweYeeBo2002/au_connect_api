import {
  sendMessage as sendMessageService,
  getConversation as getConversationService,
  getUserConversations as getUserConversationsService,
  markConversationAsRead
} from '../services/message.service.js'

async function sendMessage(req, res, next) {
  try {
    const { receiverId, content } = req.body
    const senderId = req.userData.id

    const message = await sendMessageService(senderId, receiverId, content)
    res.status(201).send({
      status: 'success',
      message: 'Message sent successfully',
      data: message
    })
  } catch (error) {
    next(error)
  }
}

async function getConversation(req, res, next) {
  try {
    const { userId } = req.params
    const currentUserId = req.userData.id

    const messages = await getConversationService(currentUserId, userId)
    res.status(200).send({
      status: 'success',
      message: 'Conversation retrieved successfully',
      data: messages
    })
  } catch (error) {
    next(error)
  }
}

async function getUserConversations(req, res, next) {
  try {
    const userId = req.userData.id

    const conversations = await getUserConversationsService(userId)
    res.status(200).send({
      status: 'success',
      message: 'Conversations retrieved successfully',
      data: conversations
    })
  } catch (error) {
    next(error)
  }
}

async function markAsRead(req, res, next) {
  try {
    const { conversationId } = req.params
    const userId = req.userData.id

    await markConversationAsRead(conversationId, userId)
    res.status(200).send({
      status: 'success',
      message: 'Messages marked as read'
    })
  } catch (error) {
    next(error)
  }
}

export {
  sendMessage,
  getConversation,
  getUserConversations,
  markAsRead
}