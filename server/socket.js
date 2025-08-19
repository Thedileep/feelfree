const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173","https://feelfree-3ktk.onrender.com/"], 
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("⚡ Socket connected:", socket.id);

    // Join a booking room
    const { bookingId } = socket.handshake.query;
    if (bookingId) {
      socket.join(bookingId);
      console.log(`Socket ${socket.id} joined room ${bookingId}`);
    }

    // Listen for typing events
    socket.on("typing", ({ bookingId, sender }) => {
      socket.to(bookingId).emit("typing", { sender });
    });

    // Listen for disconnect
    socket.on("disconnect", () => {
      console.log("⚡ Socket disconnected:", socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};

module.exports = { initSocket, getIO };
