import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import * as messageService from '../services/message.service.js';

const connectedUsers = new Map();

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        throw new Error('Authentication error');
      }

      const decoded = jwt.verify(token, config.jwtSecret);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.userId);
    connectedUsers.set(socket.userId, socket.id);

    socket.on('send_message', async (data) => {
      try {
        const { receiverId, content } = data;
        const message = await messageService.sendMessage(socket.userId, receiverId, content);
        
        // Send to receiver if online
        const receiverSocketId = connectedUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receive_message', message);
        }
        
        // Send back to sender
        socket.emit('message_sent', message);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('typing', (data) => {
      const receiverSocketId = connectedUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user_typing', { userId: socket.userId });
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.userId);
      connectedUsers.delete(socket.userId);
    });
  });

  return io;
};

export default initializeSocket;