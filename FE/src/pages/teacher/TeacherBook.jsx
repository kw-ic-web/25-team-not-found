import { useEffect, useMemo, useRef, useState } from "react";
// import { api } from "../lib/api";
import SectionList from "../../components/editor/SectionList";

// 최소 마크다운 렌더러
function simpleMarkdown(md) {
  if (!md) return "";
  let html = md
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/gim, "<b>$1</b>")
    .replace(/\*(.*?)\*/gim, "<i>$1</i>")
    .replace(/^- (.*)$/gim, "<li>$1</li>")
    .replace(/\[(.*?)\]\((.*?)\)/gim, `<a class="text-sky-600 underline" href="$2" target="_blank" rel="noreferrer">$1</a>`)
    .replace(/!\[(.*?)\]\((.*?)\)/gim, `<img alt="$1" src="$2" style="max-width:100%; border-radius:8px;"/>`)
    .replace(/(\n){2,}/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
  return html;
}

export default function TeacherBook() {
  const bookId = "sample-book-1";

  // 좌측 섹션
  const [sections, setSections] = useState([
    { id: "s1", title: "/", order: 1 },
    { id: "s2", title: "1장: 기본 개념", order: 2 },
    { id: "s3", title: "2장: 응용", order: 3 },
    { id: "s4", title: "정리", order: 4 },
  ]);
  const [currentId, setCurrentId] = useState("s1");

  // 에디터 상태
  const [title, setTitle] = useState("현대 디자인의 원리");
  const [markdown, setMarkdown] = useState(
    "...."
  );
  const [preview, setPreview] = useState(false);
  const [status, setStatus] = useState("임시 저장됨");

  const textareaRef = useRef(null);
  const htmlPreview = useMemo(() => simpleMarkdown(markdown), [markdown]);

  useEffect(() => {
    // 초기 로드 백엔드 연결할 떄
    (async () => {
      try {
        // const list = await api.get(`/books/${bookId}/sections`);
        // setSections(list); if (list?.[0]) setCurrentId(list[0].id);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    // 섹션 전환 시 제목/내용 로드 백엔드 연결 
    const found = sections.find((x) => x.id === currentId);
    if (found) setTitle(found.title);
  }, [currentId, sections]);

  // 임시 저장
  useEffect(() => {
    setStatus("수정 중…");
    const t = setTimeout(async () => {
      try {
        // await api.put(`/books/${bookId}/sections/${currentId}`, { title, markdown });
        setStatus("임시 저장됨");
      } catch {
        setStatus("저장 실패");
      }
    }, 1200);
    return () => clearTimeout(t);
  }, [title, markdown, currentId]);

  // 툴바 커맨드
  const applyCmd = (type) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const selected = markdown.slice(start, end);

    const wrap = (prefix, suffix = "") => {
      const before = markdown.slice(0, start);
      const after = markdown.slice(end);
      const next = `${before}${prefix}${selected || ""}${suffix}${after}`;
      setMarkdown(next);
      setTimeout(() => {
        el.focus();
        el.selectionStart = start + prefix.length;
        el.selectionEnd = start + prefix.length + (selected || "").length;
      }, 0);
    };

    if (type === "h1") return wrap("# ");
    if (type === "h2") return wrap("## ");
    if (type === "bold") return wrap("**", "**");
    if (type === "italic") return wrap("*", "*");
    if (type === "ul") return wrap("- ");
    if (type === "link") {
      const url = prompt("링크 URL을 입력하세요");
      if (!url) return;
      const text = selected || "링크 텍스트";
      const before = markdown.slice(0, start);
      const after = markdown.slice(end);
      setMarkdown(`${before}[${text}](${url})${after}`);
      return;
    }
    if (type === "image") {
      const url = prompt("이미지 URL을 입력하세요");
      if (!url) return;
      const alt = selected || "image";
      const before = markdown.slice(0, start);
      const after = markdown.slice(end);
      setMarkdown(`${before}![${alt}](${url})${after}`);
      return;
    }
    if (type === "video") {
      const url = prompt("영상 URL(예: https://youtu.be/...)");
      if (!url) return;
      const before = markdown.slice(0, start);
      const after = markdown.slice(end);
      setMarkdown(`${before}[영상 보기](${url})${after}`);
      return;
    }
  };

  const handleSave = async () => {
    try {
      // await api.put(`/books/${bookId}/sections/${currentId}`, { title, markdown });
      setStatus("저장 완료");
      setTimeout(() => setStatus("임시 저장됨"), 1200);
    } catch {
      setStatus("저장 실패");
    }
  };

  const addSection = async (newTitle) => {
    const id = `s${Math.random().toString(36).slice(2, 8)}`;
    const created = { id, title: newTitle, order: sections.length + 1 };
    setSections((prev) => [...prev, created]);
    setCurrentId(created.id);
    setMarkdown("");
  };

  const deleteSection = async (sid) => {
    if (!sid) return;
    if (!confirm("현재 섹션을 삭제할까요?")) return;
    setSections((prev) => prev.filter((x) => x.id !== sid));
    const rest = sections.filter((x) => x.id !== sid);
    if (rest[0]) setCurrentId(rest[0].id);
    else {
      setCurrentId(null);
      setTitle("");
      setMarkdown("");
    }
  };

  return (
    <div className="flex h-[calc(100vh-0px)] bg-slate-50">
      {/* SectionList 사이드 바 */}
      <SectionList
        sections={sections}
        currentId={currentId}
        onSelect={setCurrentId}
        onAdd={addSection}
        onDelete={deleteSection}
      />

      {/* 우측 */}
      <div className="flex-1 flex flex-col">
        {/* 상단 헤더 좌측 제목, 우측 버튼 */}
        <div className="w-full bg-white border-b border-slate-200">
          <div className="mx-auto max-w-[1200px] h-14 px-6 flex items-center justify-between">
            <div className="text-slate-800 font-semibold">{title}</div>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-2 rounded-md text-sm hover:bg-slate-100 focus:outline-none"
                onClick={() => setPreview((v) => !v)}
              >
                {preview ? "편집" : "미리보기"}
              </button>
              <button
                className="px-3 py-2 rounded-md bg-sky-500 text-white text-sm hover:bg-sky-600 focus:outline-none"
                onClick={handleSave}
              >
                저장
              </button>
            </div>
          </div>
        </div>

        {/* 중앙 카드 */}
        <div className="flex-1 overflow-auto">
          <div className="mx-auto max-w-[800px] px-6 py-8">
            <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200">
              {/* 제목 입력 */}
              <div className="px-6 pt-5 pb-3 border-b border-slate-200">
                <input
                  className="w-full text-xl font-semibold outline-none border-0 focus:outline-none focus:ring-0 text-slate-800 placeholder:text-slate-400"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목을 입력하세요"
                />
              </div>

              {/* 툴바 */}
              <div className="px-6 py-2 border-b border-slate-200 flex items-center gap-2 text-slate-600">
                <button className="px-2 py-1 rounded hover:bg-slate-100 focus:outline-none" onClick={() => applyCmd("h1")}>H1</button>
                <button className="px-2 py-1 rounded hover:bg-slate-100 focus:outline-none" onClick={() => applyCmd("h2")}>H2</button>
                <button className="px-2 py-1 rounded hover:bg-slate-100 font-semibold focus:outline-none" onClick={() => applyCmd("bold")}>B</button>
                <button className="px-2 py-1 rounded hover:bg-slate-100 italic focus:outline-none" onClick={() => applyCmd("italic")}>I</button>
                <button className="px-2 py-1 rounded hover:bg-slate-100 focus:outline-none" onClick={() => applyCmd("ul")}>•</button>
                <button className="px-2 py-1 rounded hover:bg-slate-100 focus:outline-none" onClick={() => applyCmd("link")}>🔗</button>
                <button className="px-2 py-1 rounded hover:bg-slate-100 focus:outline-none" onClick={() => applyCmd("image")}>🖼</button>
                <button className="px-2 py-1 rounded hover:bg-slate-100 focus:outline-none" onClick={() => applyCmd("video")}>🎬</button>
              </div>

              {/* 본문*/}
              <div className="px-6 py-6">
                {!preview ? (
                  <textarea
                    ref={textareaRef}
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                    className="w-full h-[360px] resize-none outline-none border-0 focus:ring-0 focus:outline-none leading-7 text-slate-800 placeholder:text-slate-400"
                    placeholder="마크다운 문법으로 내용을 작성하세요. 예) # 제목, **굵게**, - 리스트, [링크](https://...)"
                  />
                ) : (
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: htmlPreview }}
                  />
                )}
              </div>
            </div>

            {/* 페이지 네비게이션 */}
            <div className="mt-4 flex items-center justify-center gap-4">
              <button
                className="px-4 py-2 rounded-md bg-slate-200 text-slate-800 hover:bg-slate-300 focus:outline-none"
                onClick={() => {
                  const idx = sections.findIndex((x) => x.id === currentId);
                  if (idx > 0) setCurrentId(sections[idx - 1].id);
                }}
              >
                ‹ 이전
              </button>

              <div className="text-sm font-semibold text-slate-700">
                {sections.length
                  ? `${sections.findIndex((x) => x.id === currentId) + 1} / ${sections.length}`
                  : "0 / 0"}
              </div>

              <button
                className="px-4 py-2 rounded-md bg-sky-500 text-white hover:bg-sky-600 focus:outline-none"
                onClick={() => {
                  const idx = sections.findIndex((x) => x.id === currentId);
                  if (idx < sections.length - 1) setCurrentId(sections[idx + 1].id);
                }}
              >
                다음 ›
              </button>
            </div>

            {/* 상태 표시 */}
            <div className="mt-4 text-center text-xs text-emerald-600">
              상태: {status}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
