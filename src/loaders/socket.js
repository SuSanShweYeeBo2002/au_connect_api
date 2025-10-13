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

  // Make connected users available to express routes
  server.connectedUsers = connectedUsers;

  io.use(async (socket, next) => {
    try {
      console.log('🔐 Socket authentication attempt:', {
        auth: socket.handshake.auth,
        query: socket.handshake.query
      });
      
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      if (!token) {
        console.log('❌ No token provided in auth or query');
        throw new Error('No authentication token provided');
      }

      console.log('🔍 Verifying token:', token.substring(0, 20) + '...');
      const decoded = jwt.verify(token, config.jwtSecret);
      socket.userId = decoded.id;
      console.log('✅ Socket authenticated for user:', decoded.id);
      next();
    } catch (err) {
      console.log('❌ Socket authentication failed:', err.message);
      next(new Error('Authentication error: ' + err.message));
    }
  });

  io.on('connection', (socket) => {
    connectedUsers.set(socket.userId, socket.id);
    console.log('🟢 User connected:', socket.userId, '| Socket ID:', socket.id);
    console.log('👥 Connected users:', Array.from(connectedUsers.keys()));

    socket.on('send_message', async (data) => {
      try {
        console.log('📤 Message received:', {
          from: socket.userId,
          to: data.receiverId,
          content: data.content?.substring(0, 50) + '...'
        });
        
        const { receiverId, content } = data;
        const message = await messageService.sendMessage(socket.userId, receiverId, content);
        
        console.log('💾 Message saved to database:', message._id);
        
        // Send to receiver if online
        const receiverSocketId = connectedUsers.get(receiverId);
        if (receiverSocketId) {
          console.log('📨 Sending to receiver:', receiverId, '| Socket:', receiverSocketId);
          io.to(receiverSocketId).emit('receive_message', message);
        } else {
          console.log('👻 Receiver not online:', receiverId);
        }
        
        // Send back to sender
        console.log('✅ Confirming message sent to sender');
        socket.emit('message_sent', message);
      } catch (error) {
        console.log('❌ Message error:', error.message);
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('typing', (data) => {
      console.log('⌨️ Typing event:', socket.userId, '→', data.receiverId);
      const receiverSocketId = connectedUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user_typing', { userId: socket.userId });
      }
    });

    socket.on('disconnect', () => {
      console.log('🔴 User disconnected:', socket.userId);
      connectedUsers.delete(socket.userId);
      console.log('👥 Remaining connected users:', Array.from(connectedUsers.keys()));
    });
  });

  return io;
};

export default initializeSocket;