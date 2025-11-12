import sessionHandler from './session.handler.js';

export const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Mount handlers
    sessionHandler(io, socket);

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};
