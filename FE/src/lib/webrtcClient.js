import { io } from "socket.io-client";

const SIGNALING_URL = import.meta.env.VITE_SIGNALING_URL;

if (!SIGNALING_URL) {
  console.warn(
    "[webrtcClient] VITE_SIGNALING_URL 이 .env 에 설정되어 있지 않습니다."
  );
}

// socket 인스턴스 하나만 재사용
let socket = null;

export function getWebRTCSocket() {
  if (!socket) {
    socket = io(SIGNALING_URL, {
      transports: ["websocket"],
      withCredentials: false,
    });

    socket.on("connect", () => {
      console.log("[WebRTC] connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("[WebRTC] disconnected");
    });
  }

  return socket;
}
