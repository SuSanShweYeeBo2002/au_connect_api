import Message from '../models/message.js'
import { checkIfBlockedService } from './block.service.js'

async function sendMessage(senderId, receiverId, content) {
  try {
    // Check if either user has blocked the other
    const isBlocked = await checkIfBlockedService(senderId, receiverId)
    if (isBlocked) {
      const err = new Error()
      err.message = 'Cannot send message. User is blocked or has blocked you.'
      err.status = 403
      throw err
    }
    
    const message = await new Message({
      sender: senderId,
      receiver: receiverId,
      content
    }).save()
    return message.populate(['sender', 'receiver'])
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status
    throw err
  }
}

async function getConversation(user1Id, user2Id) {
  try {
    const messages = await Message.find({
      $or: [
        { sender: user1Id, receiver: user2Id },
        { sender: user2Id, receiver: user1Id }
      ]
    })
      .sort({ createdAt: 1 })
      .populate(['sender', 'receiver'])
    return messages
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status
    throw err
  }
}

async function getUserConversations(userId) {
  try {
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    })
      .sort({ createdAt: -1 })
      .populate(['sender', 'receiver'])

    const conversations = {}
    messages.forEach((message) => {
      const otherUser = message.sender._id.toString() === userId.toString()
        ? message.receiver
        : message.sender
      
      if (!conversations[otherUser._id]) {
        conversations[otherUser._id] = {
          user: otherUser,
          lastMessage: message,
          unreadCount: message.receiver._id.toString() === userId.toString() && !message.read ? 1 : 0
        }
      } else if (message.receiver._id.toString() === userId.toString() && !message.read) {
        conversations[otherUser._id].unreadCount++
      }
    })

    return Object.values(conversations)
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status
    throw err
  }
}

async function markConversationAsRead(conversationId, userId) {
  try {
    await Message.updateMany(
      {
        receiver: userId,
        sender: conversationId,
        read: false
      },
      {
        read: true
      }
    )
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status
    throw err
  }
}

async function deleteMessage(messageId, userId) {
  try {
    const message = await Message.findById(messageId)
    
    if (!message) {
      const err = new Error('Message not found')
      err.status = 404
      throw err
    }

    // Check if the user is authorized to delete the message (only sender can delete)
    if (message.sender.toString() !== userId.toString()) {
      const err = new Error('Unauthorized to delete this message')
      err.status = 403
      throw err
    }

    await Message.findByIdAndDelete(messageId)
    return { message: 'Message deleted successfully' }
  } catch (error) {
    const err = new Error()
    err.message = error.message
    err.status = error.status || 500
    throw err
  }
}

export {
  sendMessage,
  getConversation,
  getUserConversations,
  markConversationAsRead,
  deleteMessage
}