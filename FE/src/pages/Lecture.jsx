import { useEffect, useMemo, useState } from "react";
const BASE = import.meta.env.VITE_API_URL;

async function createSession(bookId) {
  if (!bookId) throw new Error("교재 ID를 입력하세요.");
  // MOCK 동작 (백엔드 붙기 전)
  if (!BASE) {
    await new Promise((r) => setTimeout(r, 600));
    return { ok: true, sessionId: "mock-" + Date.now(), roomUrl: "#", message: "세션이 mock으로 생성되었습니다." };
  }
  // API
  const res = await fetch(`${BASE}/lectures/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" /*, Authorization: `Bearer ${token}`*/ },
    body: JSON.stringify({ bookId }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/** 재사용 버튼 */
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

/** 진행률 바 */
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

/** 비디오 */
function VideoTile({ label, kind = "teacher" }) {
  const bg = kind === "teacher" ? "bg-slate-800" : "bg-slate-700";
  return (
    <div className={`${bg} rounded-lg relative w-full h-60`}>
      <div className="absolute left-2 bottom-2 px-2 py-0.5 rounded bg-black/60">
        <span className="text-white text-xs font-medium">{label}</span>
      </div>
    </div>
  );
}

/** 아이콘 버튼 */
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
      {label === "수업시작" && "▶"}
    </button>
  );
}

export default function Lecture() {
  // 상태들
  const [bookId, setBookId] = useState("");
  const [creating, setCreating] = useState(false);
  const [sessionResult, setSessionResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // 진행률/페이지 
  const [page, setPage] = useState(3);
  const [totalPage, setTotalPage] = useState(12);
  const progress = useMemo(() => Math.round((page / totalPage) * 100), [page, totalPage]);

  // 본문 섹션
  const [sections, setSections] = useState([
    {
      title: "1장: 미적분학 입문",
      desc: "극한, 미분, 적분의 기본 개념과 응용을 학습합니다.",
      items: [
        { h3: "1.1 극한", text: "미적분학에서 ‘극한’은 변수 x가 특정 값에 접근할 때 f(x)가 가까워지는 값을 설명합니다." },
        { h3: "1.2 미분", text: "미분은 순간 변화율(접선의 기울기)입니다." },
        { h3: "1.3 적분", text: "적분은 면적/누적을 계산합니다. 기본정리에 의해 ∫ f(x)dx = F(b) - F(a) 입니다." },
      ],
    },
  ]);

  // 세션 생성 요청 
  async function handleCreateSession(e) {
    e.preventDefault();
    setCreating(true);
    setErrorMsg("");
    setSessionResult(null);
    try {
      const res = await createSession(bookId.trim());
      setSessionResult(res);
    } catch (err) {
      setErrorMsg(err?.message || "세션 생성 중 오류");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F6F7F8] to-white isolate">
      {/* H */}
      <header className="sticky top-0 z-10 h-16 bg-white">
        <div className="max-w-[1536px] mx-auto h-full px-6 flex items-center justify-between">
          {/* 로고 + 학급/과목 + 진행률 */}
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded bg-[#13A4EC] grid place-items-center text-white font-bold">E</div>
            <div className="flex flex-col">
              <strong className="text-slate-800 leading-none">EduNote</strong>
              <span id="title">1학년 2반 · 수학 · 미적분학 입문</span>
            </div>
            <div className="pl-4">
              <ProgressStrip value={progress} />
            </div>
          </div>

          {/* 상태 */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm text-slate-600">실시간 수업 중</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
            </div>
          </div>
        </div>
      </header>

      {/* 컨텐츠  */}
      <div className="max-w-[1536px] mx-auto px-6 py-6">
        {/* 교재ID + 강의실 개설 요청 + (출력) 세션 결과 
        
         <form onSubmit={handleCreateSession} className="mb-4 flex flex-col gap-3 md:flex-row md:items-center">
          <label className="text-sm text-slate-600 w-24">교재 ID</label>
          <input
            className="flex-1 min-w-0 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-sky-300"
            placeholder="예) BOOK-2025-0001"
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
          /> 
          <button
            type="submit"
            disabled={creating}
            className="px-4 py-2 rounded-lg bg-[#13A4EC] text-white font-semibold shadow-sm disabled:opacity-60"
          >
            {creating ? "생성 중…" : "강의실 개설 요청"}
          </button>
        </form>

        {/* 세션 생성 결과 
        <div className="mb-6">
          {errorMsg && <p className="text-red-600 text-sm">❌ {errorMsg}</p>}
          {sessionResult && (
            <div className="text-sm text-slate-700 bg-slate-50 border rounded-lg p-3">
              <div className="font-semibold mb-1">세션 생성 결과</div>
              <div>sessionId: <span className="font-mono">{sessionResult.sessionId}</span></div>
              {"roomUrl" in sessionResult && (
                <div>
                  roomUrl:{" "}
                  <a className="text-sky-600 underline" href={sessionResult.roomUrl} target="_blank" rel="noreferrer">
                    {sessionResult.roomUrl}
                  </a>
                </div>
              )}
              {"message" in sessionResult && <div>message: {sessionResult.message}</div>}
            </div>
          )}
        </div>
        
        */}

        {/* 메인 + 사이드바 */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main */}
          <section className="xl:col-span-2 bg-white rounded-lg shadow-sm relative">
            {/* 상단 타이틀/설명 */}
            <div className="p-6 ">
              <h2 className="text-2xl font-extrabold text-slate-900">{sections[0]?.title}</h2>
              <p className="text-slate-600 mt-1">{sections[0]?.desc}</p>
            </div>

            {/* 툴바 */}
            <div className="px-6 py-4  bg-slate-50">
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
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#13A4EC] text-white shadow-sm">
                  완료 표시
                </button>
              </div>
            </div>

            {/* 본문 */}
            <div className="p-6 space-y-8">
              {sections[0]?.items.map((it, idx) => (
                <article key={idx} className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900">{it.h3}</h3>
                  <p className="text-slate-700 leading-7">
                    {it.text} {/* 수식/하이라이트는 나중에 */}
                  </p>
                </article>
              ))}
            </div>

            {/* 페이지 네비 */}
            <div className="p-4 flex items-center justify-center gap-4">
              <button
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#13A4EC] text-white shadow-sm disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                이전
              </button>
              <div className="min-w-[120px] text-center text-slate-700 font-semibold">
                {page} / {totalPage}
              </div>
              <button
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#13A4EC] text-white shadow-sm disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
                disabled={page >= totalPage}
              >
                다음
              </button>
            </div>
          </section>

          {/* 화상 통화 + 컨트롤 */}
          <aside className="xl:col-span-1 space-y-4">
            <div className="bg-white rounded-lg shadow-sm  p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-3">화상 통화</h3>

              <div className="space-y-4">
                <VideoTile label="선생님" kind="teacher" />
                <VideoTile label="나" kind="me" />
              </div>

              <div className="mt-4 flex items-center justify-center gap-2">
                <CircleIconButton label="마이크" />
                <CircleIconButton label="카메라" />
                <CircleIconButton label="종료" variant="danger" />
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* 수업 시작 + 세션 연결 버튼 */}
      <div className="fixed right-6 bottom-6">
        <CircleIconButton label="수업시작" variant="primary" onClick={() => alert("세션에 연결(추후 구현)")} />
      </div>
    </div>
  );
}
