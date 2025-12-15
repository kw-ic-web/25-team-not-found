// 1) 화상 통화 방 (textbook 기준)
//    roomId = `video:textbook:${textbookId}`
//    예) "video:textbook:3"

// 2) 교재 편집 방 (textbook + page 기준)
//    roomId = `edit:textbook:${textbookId}:page:${pageId}`
//    예) "edit:textbook:3:page:12"

// 3) 저장 완료(수정완료) 알림 방 (textbook + page 기준)
//    roomId = `edit:textbook:${textbookId}:page:${pageId}`
//    예) "edit:textbook:3:page:12"

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
    console.log(`join_room: ${userName} -> ${roomId}`);
    socket.join(roomId);

    socket.to(roomId).emit("peer_joined", {
      socketId: socket.id,
      userName,
    });
  });

  socket.on("webrtc_offer", ({ roomId, sdp }) => {
    console.log(`webrtc_offer from ${socket.id} to room ${roomId}`);
    socket.to(roomId).emit("webrtc_offer", {
      sdp,
      senderId: socket.id,
    });
  });

  socket.on("webrtc_answer", ({ roomId, sdp }) => {
    console.log(`webrtc_answer from ${socket.id} to room ${roomId}`);
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

  socket.on("refresh_request", ({ roomId, textbookId, pageId, userName }) => {
    console.log(
      `refresh_request: ${userName} saved -> notify refresh in ${roomId} (${textbookId}/${pageId})`
    );

    io.to(roomId).emit("refresh_required", {
      textbookId,
      pageId,
      from: userName,
      at: new Date().toISOString(),
      reason: "save_success",
    });
  });

  socket.on("leave_room", ({ roomId }) => {
    console.log(`leave_room: ${socket.id} from ${roomId}`);
    socket.leave(roomId);

    socket.to(roomId).emit("peer_left", {
      socketId: socket.id,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 21098;
server.listen(PORT, () => {
  console.log(`WebRTC signaling server on http://localhost:${PORT}`);
});