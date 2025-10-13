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
          content: data.content?.substring(0, 50) + '...',
          senderSocket: socket.id
        });
        
        const { receiverId, content } = data;
        
        // Validate that sender and receiver are different
        if (receiverId === socket.userId) {
          console.log('🚫 Cannot send message to self');
          socket.emit('error', { message: 'Cannot send message to yourself' });
          return;
        }
        
        // DISABLED: Socket message creation to prevent duplication
        // Messages are now sent via HTTP API which broadcasts via WebSocket
        console.log('� Socket message creation disabled - use HTTP API instead');
        socket.emit('error', { 
          message: 'Use HTTP API for sending messages. Socket is for real-time features only.' 
        });
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