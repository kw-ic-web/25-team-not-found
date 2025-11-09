export default function SectionList({ sections, currentId, onSelect, onAdd, onDelete }) {
    return (

      <aside className="w-80 h-full bg-white flex flex-col">
        {/* 헤더 */}
        <div className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-sky-500" />
            {/* 텍스트만 */}
            <h1 className="text-slate-800 font-bold text-lg">교재 제작</h1>
          </div>
        </div>
  
        <div className="px-6 pb-7">
          <div className="text-xs font-semibold tracking-wider uppercase text-slate-500">
            페이지
          </div>
        </div>
  
        <div className="flex-1 overflow-y-auto px-4 space-y-1">
          {sections.map((s) => {
            const active = s.id === currentId;
            return (
              <button
                key={s.id}
                onClick={() => onSelect(s.id)}
                className={[
                  "w-full flex items-center justify-between px-2 py-2 rounded-md text-sm",
                  active
                    ? "bg-sky-50 text-sky-600"
                    : "hover:bg-slate-100 text-slate-800",
                ].join(" ")}
              >
                <span className="truncate">{s.title}</span>
                {!active ? <span className="opacity-50">›</span> : <span className="opacity-60">✓</span>}
              </button>
            );
          })}
        </div>
  
        <div className="mt-4 p-4 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {/* 버튼 */}
            <button
              className="flex items-center justify-center gap-2 py-2 rounded-md text-sm bg-sky-50 text-sky-600 hover:bg-sky-100"
              onClick={() => setCreating ? null : onAdd?.("새 페이지")}
            >
              + 페이지 추가
            </button>
            <button
              className="flex items-center justify-center gap-2 py-2 rounded-md text-sm bg-rose-100 text-rose-600 hover:bg-rose-200"
              onClick={() => onDelete(currentId)}
            >
              삭제
            </button>
          </div>
  
          <button className="w-full py-2 rounded-md text-sm bg-sky-500 text-white hover:bg-sky-600">
            퀴즈 만들기
          </button>
        </div>
      </aside>
    );
  }
  