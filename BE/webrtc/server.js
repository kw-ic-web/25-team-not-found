const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "WebRTC signaling server running" });
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", ({ roomId, userName }) => {
    socket.join(roomId);
    socket.to(roomId).emit("peer_joined", {
      socketId: socket.id,
      userName,
    });
  });

  socket.on("webrtc_offer", ({ roomId, sdp }) => {
    socket.to(roomId).emit("webrtc_offer", {
      sdp,
      senderId: socket.id,
    });
  });

  socket.on("webrtc_answer", ({ roomId, sdp }) => {
    socket.to(roomId).emit("webrtc_answer", {
      sdp,
      senderId: socket.id,
    });
  });

  socket.on("webrtc_ice", ({ roomId, candidate }) => {
    socket.to(roomId).emit("webrtc_ice", {
      candidate,
      senderId: socket.id,
    });
  });

  socket.on("editing_state", ({ roomId, isEditing, userName }) => {
    console.log(`editing_state: ${userName} in ${roomId} => ${isEditing}`);

    socket.to(roomId).emit("editing_state", {
      socketId: socket.id,
      userName,
      isEditing,
    });
  });

  socket.on("leave_room", ({ roomId }) => {
    socket.leave(roomId);
    socket.to(roomId).emit("peer_left", {
      socketId: socket.id,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`WebRTC signaling server on http://localhost:${PORT}`);
});
