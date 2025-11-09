import { useEffect } from "react"

export default function StudentBoard({ open, onClose, student }) {
  // ESC 로 닫기
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose?.() }
    if (open) window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  // 포맷 헬퍼(없으면 기본값)
  const s = student ?? {
    name: "Olivia Hayes",
    email: "olivia.hayes@email.com",
    avatar: "https://picsum.photos/96?u=olivia",
    lastSeen: "1일 전",
    progress: 90,
    quiz: 92,
    attendance: 100,
    activity: [
      { type: "ok",    title: "자료 열람: 'Algebra Basics'", time: "1일 전" },
      { type: "warn",  title: "과제 2 지각 제출",               time: "3일 전" },
      { type: "bad",   title: "퀴즈 실패: Chapter 3",            time: "5일 전" },
    ],
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 transition ${
          open ? "visible" : "invisible"
        }`}
        aria-hidden={!open}
      >
        {/* Clickable backdrop (blur + dim) */}
        <div
          className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={onClose}
        />
      </div>

      {/* Panel */}
      <aside
        className={`fixed top-0 right-0 z-50 h-screen w-[767px] max-w-[90vw]
          bg-white border border-neutral-200 shadow-2xl rounded-l-2xl
          translate-x-0 transition-transform duration-300
          ${open ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-[459px] px-6 py-4 border-b">
          <div className="mx-auto flex items-center gap-3 w-[217px]">
            <img
              src={s.avatar}
              alt={s.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="leading-tight">
              <div className="text-[18px] leading-7 font-bold text-neutral-800">{s.name}</div>
              <div className="text-sm text-neutral-500">{s.email}</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 hover:bg-neutral-200"
            aria-label="닫기"
            title="닫기"
          >
            {/* 아이콘 대체(×) */}
            <span className="text-lg leading-none text-neutral-800">×</span>
          </button>
        </div>

        {/* Body */}
        <div className="h-[calc(100vh-81px)] overflow-y-auto p-6 space-y-6">
          {/* 상단 지표 4칸 */}
          <div className="flex items-start justify-center gap-4 max-w-[717px]">
            {/* 최근 접속 */}
            <div className="w-[167.5px]">
              <div className="text-[12px] text-neutral-500 text-center">최근 접속</div>
              <div className="text-[16px] font-semibold text-neutral-800 text-center">{s.lastSeen}</div>
            </div>
            {/* 진도율 */}
            <div className="w-[167.5px]">
              <div className="text-[12px] text-neutral-500 text-center">진도율</div>
              <div className="text-[16px] font-semibold text-neutral-800 text-center">{s.progress}%</div>
            </div>
            {/* 평균 퀴즈 */}
            <div className="w-[167.5px]">
              <div className="text-[12px] text-neutral-500 text-center">평균 퀴즈</div>
              <div className="text-[16px] font-semibold text-neutral-800 text-center">{s.quiz}%</div>
            </div>
            {/* 출석 */}
            <div className="w-[167.5px]">
              <div className="text-[12px] text-neutral-500 text-center">출석</div>
              <div className="text-[16px] font-semibold text-neutral-800 text-center">{s.attendance}%</div>
            </div>
          </div>

          {/* 버튼 2개 */}
          <div className="flex items-center justify-center gap-3 max-w-[717px]">
            <button className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-sky-500 text-white text-sm font-medium hover:bg-sky-600 w-[352px] justify-center">
              <span className="inline-block w-6 h-6 rounded bg-white/30" />
              메시지 보내기
            </button>
            <button className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-neutral-300 text-neutral-800 text-sm hover:bg-neutral-50 w-[354px] justify-center">
              <span className="inline-block w-6 h-6 rounded bg-neutral-900/10" />
              노트 추가
            </button>
          </div>

          {/* 학습 차트(데모) */}
          <div className="space-y-4 max-w-[717px]">
            <h4 className="text-base font-bold text-neutral-800">학습 차트(데모)</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* 라인차트 박스 */}
              <div className="bg-neutral-50 rounded-xl p-4">
                <div className="text-sm font-medium text-neutral-800 mb-2">최근 6주 진도 추이</div>
                {/* 간단한 스켈레톤 */}
                <div className="relative h-[224px] w-full rounded-lg border bg-white">
                  <div className="absolute left-[10%] right-[5%] bottom-[16.6%] h-px bg-slate-300" />
                  <div className="absolute left-[10%] top-[16.6%] bottom-[16.6%] w-px bg-slate-300" />
                  {/* 라인 대충 표현 */}
                  <div className="absolute inset-0">
                    <div className="absolute left-[10%] right-[15%] top-[62.3%] bottom-[23.63%] border-2 border-sky-500 rounded" />
                    <div className="absolute left-[10%] right-[15%] top-[62.3%] bottom-[16.6%] bg-sky-500/15 rounded" />
                  </div>
                  {/* 축 라벨 */}
                  <div className="absolute left-[10%] bottom-[9.5%] text-[10px] text-slate-500">-5주</div>
                  <div className="absolute left-[23.75%] bottom-[9.5%] text-[10px] text-slate-500">-4주</div>
                  <div className="absolute left-[38.75%] bottom-[9.5%] text-[10px] text-slate-500">-3주</div>
                  <div className="absolute left-[53.75%] bottom-[9.5%] text-[10px] text-slate-500">-2주</div>
                  <div className="absolute left-[68.75%] bottom-[9.5%] text-[10px] text-slate-500">-1주</div>
                  <div className="absolute left-[83%] bottom-[9.5%] text-[10px] text-slate-500">이번주</div>
                </div>
              </div>

              {/* 도넛 차트 박스 */}
              <div className="bg-neutral-50 rounded-xl p-4">
                <div className="text-sm font-medium text-neutral-800 mb-2">출석 현황</div>
                <div className="relative h-[224px] w-full rounded-lg border bg-white grid place-items-center">
                  {/* 바탕 링 */}
                  <div className="relative w-48 h-48 rounded-full">
                    <div className="absolute inset-0 rounded-full border-[23px] border-slate-400/60 opacity-35" />
                    {/* 간이 도넛(90% 가정) */}
                    <div
                      className="absolute inset-0 rounded-full border-[23px] border-sky-500"
                      style={{ clipPath: "inset(0 0 0 0)", transform: "rotate(-90deg)" }}
                    />
                  </div>
                  {/* 중앙 텍스트 */}
                  <div className="absolute text-center">
                    <div className="text-2xl font-bold text-neutral-800">{s.attendance}%</div>
                    <div className="text-[12px] text-neutral-500">출석</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 최근 활동 */}
          <div className="space-y-3 max-w-[717px]">
            <h4 className="text-base font-bold text-neutral-800">최근 활동</h4>
            <ul className="space-y-3">
              {s.activity.map((a, i) => {
                const color =
                  a.type === "ok" ? "bg-green-500" : a.type === "warn" ? "bg-amber-500" : "bg-red-500"
                return (
                  <li key={i} className="flex items-start gap-3">
                    <span className={`inline-block w-6 h-6 rounded ${color}`} />
                    <div>
                      <div className="text-sm font-medium text-neutral-800">{a.title}</div>
                      <div className="text-[12px] text-neutral-500">{a.time}</div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </aside>
    </>
  )
}
