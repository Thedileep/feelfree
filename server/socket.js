const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://feelfree-3ktk.onrender.com/",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
    
  });

  io.on("connection", (socket) => {
  const { bookingId, role } = socket.handshake.query;

  console.log(`⚡ Socket connected: ${socket.id}, Role: ${role}, Booking: ${bookingId}`);

  if (bookingId) {
    socket.join(bookingId);
    console.log(`📌 ${role} joined booking room: ${bookingId}`);

    const room = io.sockets.adapter.rooms.get(bookingId);
    if (room && room.size === 2) {
      io.to(bookingId).emit("ready");
    }
  }

    // 📌 Typing (chat feature)
    socket.on("typing", ({ bookingId, sender }) => {
      socket.to(bookingId).emit("typing", { sender });
    });

    // 📌 WebRTC Signaling
    socket.on("offer", ({ bookingId, offer }) => {
      console.log(`📡 Offer from ${socket.id} in ${bookingId}`);
      socket.to(bookingId).emit("offer", offer);
    });

    socket.on("answer", ({ bookingId, answer }) => {
      console.log(`📡 Answer from ${socket.id} in ${bookingId}`);
      socket.to(bookingId).emit("answer", answer);
    });

    socket.on("ice-candidate", ({ bookingId, candidate }) => {
      console.log(`❄️ ICE Candidate from ${socket.id} in ${bookingId}`);
      socket.to(bookingId).emit("ice-candidate", candidate);
    });

    // 📌 Disconnect
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
