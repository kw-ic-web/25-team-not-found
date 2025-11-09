export default function Toolbar({
    onCmd,            
    onPreviewToggle,  
    preview,          
    onSave,          
    versions,         
    onRestore,       
  }) {
    return (
      <div className="w-full bg-white border-b">
        <div className="mx-auto max-w-[896px] px-2 flex items-center h-14 gap-2">
          {/* 타이틀은 input으로 처리 */}
          <div className="flex items-center gap-1">
            <button className="px-2 py-2 rounded-md hover:bg-slate-100" onClick={() => onCmd("h1")}>H1</button>
            <button className="px-2 py-2 rounded-md hover:bg-slate-100" onClick={() => onCmd("h2")}>H2</button>
            <div className="w-px h-6 bg-slate-200 mx-1" />
            <button className="px-2 py-2 rounded-md hover:bg-slate-100" onClick={() => onCmd("bold")}><b>B</b></button>
            <button className="px-2 py-2 rounded-md hover:bg-slate-100 italic" onClick={() => onCmd("italic")}>I</button>
            <div className="w-px h-6 bg-slate-200 mx-1" />
            <button className="px-2 py-2 rounded-md hover:bg-slate-100" onClick={() => onCmd("ul")}>• 리스트</button>
            <button className="px-2 py-2 rounded-md hover:bg-slate-100" onClick={() => onCmd("link")}>🔗 링크</button>
            <button className="px-2 py-2 rounded-md hover:bg-slate-100" onClick={() => onCmd("image")}>🖼 이미지</button>
            <button className="px-2 py-2 rounded-md hover:bg-slate-100" onClick={() => onCmd("video")}>🎬 영상</button>
          </div>
  
          <div className="ml-auto flex items-center gap-2">
            {/* 버전 선택/복원 */}
            <select
              className="border rounded-md px-2 py-2 text-sm"
              onChange={(e) => {
                const vid = e.target.value;
                if (vid) onRestore(vid);
              }}
              defaultValue=""
            >
              <option value="" disabled>
                버전 선택
              </option>
              {versions.map((v) => (
                <option key={v.versionId} value={v.versionId}>
                  {new Date(v.createdAt).toLocaleString()}
                </option>
              ))}
            </select>
  
            <button
              className="px-3 py-2 rounded-md border hover:bg-slate-100 text-sm"
              onClick={onPreviewToggle}
            >
              {preview ? "편집" : "미리보기"}
            </button>
            <button
              className="px-3 py-2 rounded-md bg-sky-500 text-white hover:bg-sky-600 text-sm"
              onClick={onSave}
            >
              저장
            </button>
          </div>
        </div>
      </div>
    );
  }
  