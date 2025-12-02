import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation, useSearchParams } from "react-router-dom";
import { getWebRTCSocket } from "../lib/webrtcClient";
import ic_logo from "../assets/icons/ic_logo.svg";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://team10-api.kwweb.org";

function getAccessToken() {
  try {
    return localStorage.getItem("access_token");
  } catch {
    return null;
  }
}

function authHeaders(includeJson = false) {
  const token = getAccessToken();
  return {
    ...(includeJson ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function extractTextFromNode(node) {
  if (node == null) return "";

  // 문자열
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  // 배열
  if (Array.isArray(node)) {
    return node.map(extractTextFromNode).join("");
  }

  // 객체
  if (typeof node === "object") {
    let result = "";

    if (typeof node.text !== "undefined") {
      result += extractTextFromNode(node.text);
    }
    if (typeof node.content !== "undefined") {
      result += extractTextFromNode(node.content);
    }
    if (typeof node.children !== "undefined") {
      result += extractTextFromNode(node.children);
    }

    return result;
  }

  return "";
}

function normalizePageContent(raw) {
  if (raw == null) return "";
  if (typeof raw === "string" || typeof raw === "number") {
    return String(raw);
  }

  try {
    const extracted = extractTextFromNode(raw);
    if (extracted && extracted.trim().length > 0) {
      return extracted;
    }
    // JSON 문자열
    return JSON.stringify(raw);
  } catch {
    return "";
  }
}

// API 

// 내 교재 목록
async function fetchMyTextbooks() {
  if (!BASE_URL) throw new Error("VITE_API_BASE_URL이 설정되지 않았습니다.");
  const res = await fetch(`${BASE_URL}/textbooks/mine`, {
    method: "GET",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("교재 목록을 불러올 수 없습니다.");
  return res.json(); // [{ textbook_id, title, latest_version, ... }]
}

// 특정 교재 버전의 페이지들
async function fetchTextbookPages(textbookId, version) {
  if (!BASE_URL) throw new Error("VITE_API_BASE_URL이 설정되지 않았습니다.");
  const res = await fetch(
    `${BASE_URL}/textbooks/${textbookId}/versions/${version}/pages`,
    {
      method: "GET",
      headers: authHeaders(),
    }
  );
  if (!res.ok) throw new Error("페이지 API 응답이 정상이 아닙니다.");
  return res.json(); // [{ page_id, page_number, content }, ...]
}

// 선생님 수업 세션 생성
async function createLectureSession(textbookId) {
  if (!BASE_URL) throw new Error("VITE_API_BASE_URL이 설정되지 않았습니다.");
  const res = await fetch(`${BASE_URL}/lectures/session`, {
    method: "POST",
    headers: authHeaders(true),
    body: JSON.stringify({ textbookId }),
  });
  if (!res.ok) throw new Error("수업 세션 생성에 실패했습니다.");
  return res.json();
}

// WebRTC ICE 서버 
const ICE_CONFIG = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

/** 툴바 버튼 */
function ToolbarButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white shadow-sm border hover:bg-slate-50"
    >
      <span className="text-slate-800 text-sm font-semibold">{label}</span>
    </button>
  );
}

/* 진행률 바 */
function ProgressStrip({ value = 0 }) {
  const width = Math.max(0, Math.min(100, value));
  return (
    <div className="flex items-center gap-2 w-80 max-w-full">
      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-full bg-[#13A4EC]" style={{ width: `${width}%` }} />
      </div>
      <span className="text-slate-600 text-sm font-medium">{width}%</span>
    </div>
  );
}

/* 비디오 타일 */
function VideoTile({ label, videoRef, isLocal }) {
  return (
    <div className="bg-slate-800 rounded-lg relative w-full h-60 overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className="w-full h-full object-cover"
      />
      <div className="absolute left-2 bottom-2 px-2 py-0.5 rounded bg-black/60">
        <span className="text-white text-xs font-medium">{label}</span>
      </div>
    </div>
  );
}

/* 동그란 아이콘 버튼 */
function CircleIconButton({ variant = "neutral", label, onClick }) {
  const styles =
    variant === "danger"
      ? "bg-red-500 text-white"
      : variant === "primary"
      ? "bg-[#13A4EC] text-white"
      : "bg-slate-200 text-slate-700";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-12 h-12 rounded-full grid place-items-center shadow-sm ${styles}`}
      title={label}
      aria-label={label}
    >
      {label === "마이크" && "🎤"}
      {label === "카메라" && "📷"}
      {label === "종료" && "⛔"}
    </button>
  );
}

// 메인 컴포넌트

export default function Lecture() {
  const navigate = useNavigate();

  const location = useLocation();
  const [searchParams] = useSearchParams();

  // URL ?role=teacher | student
  const roleParam = searchParams.get("role");
  const [role, setRole] = useState(() =>
    roleParam === "student" ? "student" : "teacher"
  );

  useEffect(() => {
    if (roleParam === "student") setRole("student");
    else if (roleParam === "teacher") setRole("teacher");
  }, [roleParam]);

  const [userName] = useState(() => {
    return role === "teacher" ? "선생님" : "학생";
  });

  // ───────── 교재 / 페이지 상태 ─────────
  const [textbooks, setTextbooks] = useState([]);
  const [selectedTextbookId, setSelectedTextbookId] = useState(null); // 항상 string
  const [selectedTextbookTitle, setSelectedTextbookTitle] = useState("");
  const [selectedVersion, setSelectedVersion] = useState(1);
  const [pages, setPages] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);

  const [textbookError, setTextbookError] = useState("");
  const [textbookLoading, setTextbookLoading] = useState(true);

  const totalPage = pages.length || 1;
  const progress = useMemo(
    () => Math.round(((pageIndex + 1) / totalPage) * 100),
    [pageIndex, totalPage]
  );

  // ───────── WebRTC / signaling 상태 ─────────
  const socket = useMemo(() => getWebRTCSocket(), []);
  const [roomId, setRoomId] = useState("");
  const roomIdRef = useRef("");
  const joinedOnceRef = useRef(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const localStreamRef = useRef(null);
  const [micOn, setMicOn] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);

  const pcRef = useRef(null);
  const [webrtcError, setWebrtcError] = useState("");
  const [sessionInfo, setSessionInfo] = useState(null);

  // ───────── 편집(Editing) 상태 ─────────
  const [editingRoomId, setEditingRoomId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingPeers, setEditingPeers] = useState([]);

  // ───────────────────────
  // 교재 목록 / 선택 초기화
  useEffect(() => {
    let cancelled = false;

    async function initTextbooks() {
      setTextbookLoading(true);
      setTextbookError("");
      try {
        let list;
        try {
          list = await fetchMyTextbooks();
        } catch (e) {
          console.error(e);
          list = [
            {
              textbook_id: 1,
              title: "미적분학 입문 (TEST)",
              latest_version: 1,
            },
            {
              textbook_id: 2,
              title: "대수학 기초 (TEST)",
              latest_version: 1,
            },
          ];
          if (!cancelled) {
            setTextbookError(
              "교재 목록 API 오류가 발생하여 테스트용 더미 교재를 사용합니다."
            );
          }
        }

        if (cancelled) return;
        setTextbooks(list);

        const fromModalIdRaw = location.state?.textbookId;
        const fromModalTitle =
          location.state?.title || location.state?.textbookTitle;

        if (fromModalIdRaw) {
          const fromId = String(fromModalIdRaw);
          setSelectedTextbookId(fromId);
          const matched = list.find(
            (t) => String(t.textbook_id ?? t.id) === fromId
          );
          setSelectedTextbookTitle(fromModalTitle || matched?.title || "");
          setSelectedVersion(matched?.latest_version ?? 1);
        } else if (list.length > 0) {
          const first = list[0];
          const idStr = String(first.textbook_id ?? first.id);
          setSelectedTextbookId(idStr);
          setSelectedTextbookTitle(first.title || "");
          setSelectedVersion(first.latest_version ?? 1);
        }
      } finally {
        if (!cancelled) setTextbookLoading(false);
      }
    }

    initTextbooks();
    return () => {
      cancelled = true;
    };
  }, [location.state]);

  // ───────────────────────
  // 선택된 교재/버전에 따라 페이지 로딩

  useEffect(() => {
    let cancelled = false;

    async function loadPages() {
      if (!selectedTextbookId || !selectedVersion) return;

      try {
        setTextbookError("");
        const data = await fetchTextbookPages(
          selectedTextbookId,
          selectedVersion
        );
        if (cancelled) return;
        setPages(data || []);
        setPageIndex(0);
      } catch (e) {
        console.error(e);
        if (cancelled) return;

        setTextbookError(
          "페이지 API 오류가 발생하여 테스트용 더미 페이지를 표시합니다."
        );
        const dummyPages = [
          {
            page_number: 1,
            content:
              "이것은 테스트용 더미 페이지 1입니다.\n실제 API가 연결되면 이 내용이 교재 내용으로 바뀝니다.",
          },
          {
            page_number: 2,
            content:
              "이것은 테스트용 더미 페이지 2입니다.\n선생님/학생 화상 통화와 UI만 먼저 확인해 주세요.",
          },
        ];
        setPages(dummyPages);
        setPageIndex(0);
      }
    }

    loadPages();
    return () => {
      cancelled = true;
    };
  }, [selectedTextbookId, selectedVersion]);

  // 페이지 데이터를 섹션 구조로 변환
  const sections = useMemo(() => {
    if (!pages.length) {
      return [
        {
          title: selectedTextbookTitle || "교재가 없습니다.",
          desc:
            selectedTextbookId && selectedVersion
              ? `교재 ID: ${selectedTextbookId}, 버전: ${selectedVersion}`
              : "교재를 선택해 주세요.",
          items: [],
        },
      ];
    }
    return [
      {
        title: selectedTextbookTitle || `교재 ID ${selectedTextbookId}`,
        desc: `총 ${pages.length} 페이지`,
        items: pages.map((p) => ({
          pageId: p.page_id ?? p.page_number ?? null,
          h3: `${p.page_number ?? ""} 페이지`,
          text: normalizePageContent(p.content),
        })),
      },
    ];
  }, [pages, selectedTextbookId, selectedVersion, selectedTextbookTitle]);

  // 
  // 로컬 미디어
  async function ensureLocalStream() {
    if (localStreamRef.current) return localStreamRef.current;

    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("브라우저가 카메라/마이크를 지원하지 않습니다.");
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localStreamRef.current = stream;

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    const hasAudio = stream.getAudioTracks().some((t) => t.enabled !== false);
    const hasVideo = stream.getVideoTracks().some((t) => t.enabled !== false);
    setMicOn(hasAudio);
    setCameraOn(hasVideo);

    return stream;
  }

  function stopLocalStream() {
    const stream = localStreamRef.current;
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    localStreamRef.current = null;
    setMicOn(false);
    setCameraOn(false);
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  }

  function toggleMic() {
    const stream = localStreamRef.current;
    if (!stream) return;
    const tracks = stream.getAudioTracks();
    if (!tracks.length) return;
    const next = !micOn;
    tracks.forEach((t) => {
      t.enabled = next;
    });
    setMicOn(next);
  }

  function toggleCamera() {
    const stream = localStreamRef.current;
    if (!stream) return;
    const tracks = stream.getVideoTracks();
    if (!tracks.length) return;
    const next = !cameraOn;
    tracks.forEach((t) => {
      t.enabled = next;
    });
    setCameraOn(next);
  }

  // RTCPeerConnection 생성/해제
  function createPeerConnection() {
    if (pcRef.current) return pcRef.current;
    const pc = new RTCPeerConnection(ICE_CONFIG);

    const localStream = localStreamRef.current;
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
    }

    pc.onicecandidate = (event) => {
      if (event.candidate && roomIdRef.current) {
        socket.emit("webrtc_ice", {
          roomId: roomIdRef.current,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      const [remoteStream] = event.streams;
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    };

    pcRef.current = pc;
    return pc;
  }

  function closePeerConnection() {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  }

  // ───────────────────────
  // roomId 

  function buildRoomId(textbookId) {
    if (!textbookId) return "";
    return `video:textbook:${textbookId}`;
  }

  function buildEditRoomId(textbookId, pageId) {
    if (!textbookId || !pageId) return "";
    return `edit:textbook:${textbookId}:page:${pageId}`;
  }

  // ───────────────────────
  // socket.io 이벤트 바인딩

  useEffect(() => {
    if (!socket) return;

    function handlePeerJoined(payload) {
      console.log("[Lecture] peer_joined:", payload);
      if (role !== "teacher") return;

      (async () => {
        try {
          await ensureLocalStream();
          const pc = createPeerConnection();
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          if (roomIdRef.current) {
            socket.emit("webrtc_offer", {
              roomId: roomIdRef.current,
              sdp: offer,
            });
          }
        } catch (e) {
          console.error(e);
          setWebrtcError("WebRTC offer 생성 중 오류가 발생했습니다.");
        }
      })();
    }

    async function handleWebrtcOffer(payload) {
      console.log("[Lecture] webrtc_offer 수신:", payload);
      if (role !== "student") return;

      try {
        await ensureLocalStream();
        const pc = createPeerConnection();
        await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        if (roomIdRef.current) {
          socket.emit("webrtc_answer", {
            roomId: roomIdRef.current,
            sdp: answer,
          });
        }
      } catch (e) {
        console.error(e);
        setWebrtcError("WebRTC answer 처리 중 오류가 발생했습니다.");
      }
    }

    async function handleWebrtcAnswer(payload) {
      console.log("[Lecture] webrtc_answer 수신:", payload);
      if (role !== "teacher") return;

      try {
        const pc = pcRef.current;
        if (!pc) return;
        await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
      } catch (e) {
        console.error(e);
        setWebrtcError("WebRTC answer 적용 중 오류가 발생했습니다.");
      }
    }

    async function handleWebrtcIce(payload) {
      console.log("[Lecture] webrtc_ice 수신:", payload);
      try {
        const pc = pcRef.current;
        if (!pc) return;
        await pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
      } catch (e) {
        console.error(e);
        setWebrtcError("ICE candidate 적용 중 오류가 발생했습니다.");
      }
    }

    function handlePeerLeft(payload) {
      console.log("[Lecture] peer_left:", payload);
      closePeerConnection();
    }

    function handleEditingState(payload) {
      setEditingPeers((prev) => {
        const without = prev.filter((p) => p.socketId !== payload.socketId);
        if (!payload.isEditing) {
          return without;
        }
        return [
          ...without,
          {
            socketId: payload.socketId,
            userName: payload.userName || "다른 사용자",
          },
        ];
      });
    }

    socket.on("peer_joined", handlePeerJoined);
    socket.on("webrtc_offer", handleWebrtcOffer);
    socket.on("webrtc_answer", handleWebrtcAnswer);
    socket.on("webrtc_ice", handleWebrtcIce);
    socket.on("peer_left", handlePeerLeft);
    socket.on("editing_state", handleEditingState);

    return () => {
      socket.off("peer_joined", handlePeerJoined);
      socket.off("webrtc_offer", handleWebrtcOffer);
      socket.off("webrtc_answer", handleWebrtcAnswer);
      socket.off("webrtc_ice", handleWebrtcIce);
      socket.off("peer_left", handlePeerLeft);
      socket.off("editing_state", handleEditingState);
    };
  }, [socket, role]);

  // ───────────────────────
  // 자동 방 입장 

  async function joinRoomAsTeacher() {
    if (!selectedTextbookId) {
      setWebrtcError("교재가 선택되지 않았습니다.");
      return;
    }
    setWebrtcError("");

    // /lectures/session 붙일 때 사용
    // try {
    //   const session = await createLectureSession(selectedTextbookId);
    //   setSessionInfo(session);
    // } catch (e) {
    //   console.warn("[Lecture] createLectureSession 실패, WebRTC만 진행:", e);
    // }

    const rid = buildRoomId(selectedTextbookId);
    setRoomId(rid);
    roomIdRef.current = rid;

    try {
      await ensureLocalStream();
      socket.emit("join_room", {
        roomId: rid,
        userName: userName || "선생님",
      });
      console.log("[Lecture] auto join_room (teacher):", rid);
    } catch (e) {
      console.error(e);
      setWebrtcError(e.message || "수업 시작 중 오류가 발생했습니다.");
    }
  }

  async function joinRoomAsStudent() {
    if (!selectedTextbookId) {
      setWebrtcError("교재가 선택되지 않았습니다.");
      return;
    }
    setWebrtcError("");

    const rid = buildRoomId(selectedTextbookId);
    setRoomId(rid);
    roomIdRef.current = rid;

    try {
      await ensureLocalStream();
      socket.emit("join_room", {
        roomId: rid,
        userName: userName || "학생",
      });
      console.log("[Lecture] auto join_room (student):", rid);
    } catch (e) {
      console.error(e);
      setWebrtcError(e.message || "수업 입장 중 오류가 발생했습니다.");
    }
  }

  // 자동 join_room
  useEffect(() => {
    if (!socket) return;
    if (!selectedTextbookId) return;
    if (joinedOnceRef.current) return;

    joinedOnceRef.current = true;

    if (role === "teacher") {
      joinRoomAsTeacher();
    } else {
      joinRoomAsStudent();
    }
  }, [socket, role, selectedTextbookId]);

  // 나갈 때 정리
  function leaveRoom() {
    if (roomIdRef.current) {
      socket.emit("leave_room", { roomId: roomIdRef.current });
      console.log("[Lecture] leave_room:", roomIdRef.current);
    }
    roomIdRef.current = "";
    setRoomId("");
    closePeerConnection();
    stopLocalStream();

    if (editingRoomId && isEditing) {
      socket.emit("editing_state", {
        roomId: editingRoomId,
        isEditing: false,
        userName: userName || (role === "teacher" ? "선생님" : "학생"),
      });
      setIsEditing(false);
    }
  }

  useEffect(() => {
    return () => {
      leaveRoom();
    };
  }, []);

  // ───────────────────────
  // Editing room 자동 join
  
  useEffect(() => {
    if (!socket) return;
    if (!selectedTextbookId) return;
    if (!sections.length) return;

    const currentSection = sections[0];
    const currentItem =
      currentSection && currentSection.items[pageIndex]
        ? currentSection.items[pageIndex]
        : null;

    const pageIdForRoom =
      currentItem?.pageId ?? currentItem?.page_number ?? `dummy-${pageIndex + 1}`;

    const rid = buildEditRoomId(selectedTextbookId, pageIdForRoom);
    if (!rid) return;

    setEditingRoomId(rid);

    socket.emit("join_room", {
      roomId: rid,
      userName: userName || (role === "teacher" ? "선생님" : "학생"),
    });
    console.log("[Lecture] editing join_room:", rid);
  }, [socket, selectedTextbookId, sections, pageIndex, userName, role]);

  // 편집 토글
  function toggleEditing() {
    if (!editingRoomId) return;
    const next = !isEditing;
    setIsEditing(next);
    socket.emit("editing_state", {
      roomId: editingRoomId,
      isEditing: next,
      userName: userName || (role === "teacher" ? "선생님" : "학생"),
    });
  }

  // ─────────────────────── UI
  const currentSection = sections[0];
  const currentItem =
    currentSection && currentSection.items[pageIndex]
      ? currentSection.items[pageIndex]
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F6F7F8] to-white isolate">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 h-16 bg-white">
        <div className="max-w-[1536px] mx-auto h-full px-6 flex items-center justify-between">
          {/* 로고 + 학급/과목 + 진행률 */}
          <div className="flex items-center gap-4">
            <img src={ic_logo} alt="EduNote" className="w-9 h-9 shrink-0" />
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 truncate">
              EduNote · 강의 시작
            </h1>
            <div className="flex flex-col">
             
            </div>
            <div className="pl-4">
              <ProgressStrip value={progress} />
            </div>
          </div>

          {/* 상태 */}
          <div className="flex items-center gap-3">
          <button className="h-10 px-4 rounded-lg border border-slate-300 bg-white text-[14px] text-slate-900"
          onClick={() => navigate("/teacher")}>
              대시보드
            </button>
            <div className="flex flex-col items-end text-xs text-slate-500">
              <span>역할: {role === "teacher" ? "선생님" : "학생"}</span>
              <span>사용자: {userName || "-"}</span>
            </div>
            <div className="flex items-center gap-2">
              {roomId ? (
                <>
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-sm text-slate-600">실시간 수업 중</span>
                </>
              ) : (
                <>
                  <span className="w-3 h-3 rounded-full bg-slate-300" />
                  <span className="text-sm text-slate-500">수업 대기 중</span>
                </>
              )}
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden" />
          </div>
        </div>
      </header>

      {/* 컨텐츠 */}
      <div className="max-w-[1536px] mx-auto px-6 py-6">
        {textbookError && (
          <p className="mb-2 text-xs text-red-500 whitespace-pre-line">
            {textbookError}
          </p>
        )}
        {webrtcError && (
          <p className="mb-2 text-xs text-red-500 whitespace-pre-line">
            {webrtcError}
          </p>
        )}
        {!!editingPeers.length && (
          <p className="mb-2 text-xs text-emerald-600">
            {editingPeers.map((p) => p.userName || "다른 사용자").join(", ")} 님이
            이 페이지를 편집 중입니다.
          </p>
        )}

        {/* 메인 + 사이드바 */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* 교재 */}
          <section className="xl:col-span-2 bg-white rounded-lg shadow-sm relative">
            {/* 교재 선택 드롭다운 */}
            <div className="p-6 pb-0 flex items-center gap-2">
              <span className="text-xs text-slate-500">교재 선택</span>
              <select
                className="border rounded px-2 py-1 text-sm"
                value={selectedTextbookId ?? ""}
                onChange={(e) => {
                  const nextId = e.target.value || null; // string 그대로
                  const tb = textbooks.find(
                    (t) => String(t.textbook_id ?? t.id) === nextId
                  );
                  setSelectedTextbookId(nextId);
                  setSelectedTextbookTitle(tb?.title || "");
                  setSelectedVersion(tb?.latest_version ?? 1);
                }}
              >
                {!textbooks.length && <option value="">교재 없음</option>}
                {textbooks.map((tb) => {
                  const key = String(tb.textbook_id ?? tb.id);
                  return (
                    <option key={key} value={key}>
                      {tb.title} (ID: {key.slice(0, 8)}…)
                    </option>
                  );
                })}
              </select>
              {selectedVersion && (
                <span className="ml-2 text-xs text-slate-500">
                  버전 {selectedVersion}
                </span>
              )}
            </div>

            {/* 상단 타이틀/설명 */}
            <div className="p-6 pt-4">
              <h2 className="text-2xl font-extrabold text-slate-900">
                {currentSection?.title || "교재를 선택해 주세요."}
              </h2>
              <p className="text-slate-600 mt-1">
                {currentSection?.desc || ""}
              </p>
            </div>

            {/* 툴바 */}
            <div className="px-6 py-4 bg-slate-50">
              <div className="flex items-center gap-2 overflow-x-auto">
                <ToolbarButton label="굵게" />
                <ToolbarButton label="기울임" />
                <ToolbarButton label="밑줄" />
                <div className="w-px h-6 bg-slate-300/70 mx-1" />
                <ToolbarButton label="하이라이트" />
                <ToolbarButton label="메모지" />
                <div className="w-px h-6 bg-slate-300/70 mx-1" />
                <ToolbarButton label="정렬" />
                <ToolbarButton label="목록" />
                <div className="flex-1" />

                {/* 교재 편집하기 버튼 */}
                <button
                  type="button"
                  onClick={toggleEditing}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium mr-2 ${
                    isEditing
                      ? "bg-emerald-50 border-emerald-400 text-emerald-700"
                      : "bg-white border-slate-300 text-slate-700"
                  }`}
                >
                  {isEditing ? "편집 중..." : "교재 편집하기"}
                </button>

                {/* 완료 표시 버튼 */}
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#13A4EC] text-white shadow-sm"
                >
                  완료 표시
                </button>
              </div>
            </div>

            {/* 본문 */}
            <div className="p-6 space-y-8">
              {currentItem ? (
                <article className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900">
                    {currentItem.h3}
                  </h3>
                  <p className="text-slate-700 leading-7 whitespace-pre-line">
                    {currentItem.text}
                  </p>
                </article>
              ) : (
                <p className="text-sm text-slate-500">
                  표시할 페이지가 없습니다.
                </p>
              )}
            </div>

            {/* 페이지 네비 */}
            <div className="p-4 flex items-center justify-center gap-4">
              <button
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#13A4EC] text-white shadow-sm disabled:opacity-50"
                onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                disabled={pageIndex <= 0}
              >
                이전
              </button>
              <div className="min-w-[120px] text-center text-slate-700 font-semibold">
                {pages.length ? pageIndex + 1 : 0} / {pages.length}
              </div>
              <button
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#13A4EC] text-white shadow-sm disabled:opacity-50"
                onClick={() =>
                  setPageIndex((p) => Math.min(totalPage - 1, p + 1))
                }
                disabled={pageIndex >= totalPage - 1}
              >
                다음
              </button>
            </div>
          </section>

          {/* 화상 통화 영역 */}
          <aside className="xl:col-span-1 space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-1">
                화상 통화 ·{" "}
                {role === "teacher" ? "선생님 화면" : "학생 화면"}
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                roomId: {roomId || "(미입장)"}
              </p>

              <div className="space-y-4">
                <VideoTile
                  label={role === "teacher" ? "선생님 (나)" : "학생 (나)"}
                  videoRef={localVideoRef}
                  isLocal
                />
                <VideoTile
                  label={role === "teacher" ? "학생" : "선생님"}
                  videoRef={remoteVideoRef}
                  isLocal={false}
                />
              </div>

              <div className="mt-4 flex items-center justify-center gap-2">
                <CircleIconButton
                  label="마이크"
                  onClick={toggleMic}
                  variant={micOn ? "primary" : "neutral"}
                />
                <CircleIconButton
                  label="카메라"
                  onClick={toggleCamera}
                  variant={cameraOn ? "primary" : "neutral"}
                />
                <CircleIconButton
                  label="종료"
                  variant="danger"
                  onClick={leaveRoom}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
