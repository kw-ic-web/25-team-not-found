import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StudentSidebar from "../../components/sidebar/StudentSidebar";
import api from "../../api/api";
import ic_logo from "../../assets/icons/ic_logo.svg";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { ko } from "@blocknote/core/locales";
import "@blocknote/core/style.css";
import "@blocknote/mantine/style.css";

function plainTextToBlocks(text) {
  const lines = String(text ?? "").split("\n");
  return lines.map((line) => ({
    type: "paragraph",
    content: line ? [{ type: "text", text: line }] : [],
  }));
}

function parseContentToBlocks(raw) {
  if (raw == null) return [];

  // 이미 blocks 배열이면 그대로
  if (Array.isArray(raw)) return raw;

  // 문자열이면 JSON 파싱 시도 → 실패하면 plain text로 처리
  if (typeof raw === "string") {
    const t = raw.trim();
    if (!t) return [];
    try {
      const parsed = JSON.parse(t);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && typeof parsed === "object" && Array.isArray(parsed.blocks)) {
        return parsed.blocks;
      }
      return plainTextToBlocks(raw);
    } catch {
      return plainTextToBlocks(raw);
    }
  }

  // 객체면 blocks 키가 있는지 확인
  if (typeof raw === "object") {
    if (Array.isArray(raw.blocks)) return raw.blocks;
  }

  return [];
}

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

export default function StudentBook() {
  const navigate = useNavigate();
  const location = useLocation();
  const { textbookId } = location.state || {};

  // ───────── 교재 / 페이지 상태 ─────────
  const [textbooks, setTextbooks] = useState([]);
  const [selectedTextbookId, setSelectedTextbookId] = useState(textbookId || null); // 항상 string
  const [selectedTextbookTitle, setSelectedTextbookTitle] = useState("");
  const [selectedVersion, setSelectedVersion] = useState(1);
  const [pages, setPages] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);

  const [textbookError, setTextbookError] = useState("");

  const editor = useCreateBlockNote({ dictionary: ko });
  const loadedKeyRef = useRef("");

  const totalPage = pages.length || 1;
  const progress = useMemo(
    () => Math.round(((pageIndex + 1) / totalPage) * 100),
    [pageIndex, totalPage]
  );

  // ───────────────────────
  // 교재 목록 / 선택 초기화
  useEffect(() => {
    let cancelled = false;

    async function initTextbooks() {
      setTextbookError("");
      try {
        let list;
        try {
          const { data } = await api.get("/textbooks/enrolled");
          list = data;
          const selectedTextbook = list.find((t) => t.textbook_id === textbookId);
          if (selectedTextbook) {
            setSelectedTextbookId(selectedTextbook.textbook_id);
            setSelectedTextbookTitle(selectedTextbook.title);
            setSelectedVersion(selectedTextbook.latest_version);
          } else if (list.length > 0) {
            setSelectedTextbookId(list[0].textbook_id);
            setSelectedTextbookTitle(list[0].title);
            setSelectedVersion(list[0].latest_version);
          }
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
            setTextbookError("교재 목록 API 오류가 발생하여 테스트용 더미 교재를 사용합니다.");
          }
        }

        if (cancelled) return;
        setTextbooks(list);

        const fromModalIdRaw = location.state?.textbookId;
        const fromModalTitle = location.state?.title || location.state?.textbookTitle;

        if (fromModalIdRaw) {
          const fromId = String(fromModalIdRaw);
          setSelectedTextbookId(fromId);
          const matched = list.find((t) => String(t.textbook_id ?? t.id) === fromId);
          setSelectedTextbookTitle(fromModalTitle || matched?.title || "");
          setSelectedVersion(matched?.latest_version ?? 1);
        } else if (list.length > 0) {
          const first = list[0];
          const idStr = String(first.textbook_id ?? first.id);
          setSelectedTextbookId(idStr);
          setSelectedTextbookTitle(first.title || "");
          setSelectedVersion(first.latest_version ?? 1);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("교재 초기화 오류:", error);
        }
      }
    }

    initTextbooks();
    return () => {
      cancelled = true;
    };
  }, [location.key, location.state, textbookId]);

  // ───────────────────────
  // 선택된 교재/버전에 따라 페이지 로딩
  useEffect(() => {
    let cancelled = false;

    async function loadPages() {
      if (!selectedTextbookId || !selectedVersion) return;

      try {
        setTextbookError("");
        const { data } = await api.get(
          `/textbooks/${selectedTextbookId}/versions/${selectedVersion}/pages`
        );
        if (cancelled) return;
        setPages(data || []);
        setPageIndex(0);
        loadedKeyRef.current = ""; // 페이지 목록이 변경되면 loadedKey 초기화
      } catch (e) {
        console.error(e);
        if (cancelled) return;

        setTextbookError("페이지 API 오류가 발생하여 테스트용 더미 페이지를 표시합니다.");
        const dummyPages = [
          {
            page_number: 1,
            content:
              "이것은 테스트용 더미 페이지 1입니다.\n실제 API가 연결되면 이 내용이 교재 내용으로 바뀝니다.",
          },
          {
            page_number: 2,
            content: "이것은 테스트용 더미 페이지 2입니다.\n교재 내용을 확인해 주세요.",
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

  // pages/pageIndex가 바뀔 때마다 현재 페이지 내용을 BlockNote에 주입
  useEffect(() => {
    if (!editor) return;
    if (!pages || pages.length === 0) return;
    if (pageIndex < 0 || pageIndex >= pages.length) return;

    const current = pages[pageIndex];
    if (!current) return;

    const pageId = String(
      current.page_id ?? current.pageId ?? current.id ?? current.page_number ?? pageIndex + 1
    );
    const key = `${selectedTextbookId ?? ""}:${selectedVersion ?? ""}:${pageId}`;

    // 같은 페이지에서 타이핑할 때 pages state를 건드리면 재실행될 수 있으니,
    // "이미 로드한 페이지"면 replaceBlocks를 다시 하지 않음
    if (loadedKeyRef.current === key) return;
    loadedKeyRef.current = key;

    const raw = current.content;
    const blocks = parseContentToBlocks(raw);

    // blocks가 비어있으면 기본 paragraph 추가
    const finalBlocks = blocks.length > 0 ? blocks : [{ type: "paragraph", content: [] }];

    // editor.document가 준비되었는지 확인 후 blocks 교체
    // 약간의 지연을 두어 editor가 완전히 초기화되도록 함
    const timer = setTimeout(() => {
      try {
        if (editor && editor.document) {
          editor.replaceBlocks(editor.document, finalBlocks);
        }
      } catch (error) {
        console.error("BlockNote blocks 교체 오류:", error);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [pageIndex, pages, editor, selectedTextbookId, selectedVersion]);

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
        })),
      },
    ];
  }, [pages, selectedTextbookId, selectedVersion, selectedTextbookTitle]);

  // ─────────────────────── UI
  const currentSection = sections[0];
  const currentPage = pages[pageIndex];

  return (
    <main className="flex w-full h-full bg-[#F6F7F8]">
      <StudentSidebar />
      <div className="flex-1 min-h-screen bg-gradient-to-b from-[#F6F7F8] to-white isolate">
        {/* 헤더 */}
        <header className="sticky top-0 z-10 h-16 bg-white">
          <div className="max-w-[1536px] mx-auto h-full px-6 flex items-center justify-between">
            {/* 로고 + 교재명 + 진행률 */}
            <div className="flex items-center gap-4">
              <img src={ic_logo} alt="EduNote" className="w-9 h-9 shrink-0" />
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 truncate">
                EduNote · 교재 학습
              </h1>
              <div className="pl-4">
                <ProgressStrip value={progress} />
              </div>
            </div>

            {/* 상태 */}
            <div className="flex items-center gap-3">
              <button
                className="h-10 px-4 rounded-lg border border-slate-300 bg-white text-[14px] text-slate-900"
                onClick={() => navigate("/student")}
              >
                대시보드
              </button>
            </div>
          </div>
        </header>

        {/* 컨텐츠 */}
        <div className="max-w-[1536px] mx-auto px-6 py-6">
          {textbookError && (
            <p className="mb-2 text-xs text-red-500 whitespace-pre-line">{textbookError}</p>
          )}

          {/* 메인 */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* 교재 */}
            <section className="xl:col-span-3 bg-white rounded-lg shadow-sm relative">
              {/* 교재 선택 드롭다운 */}
              <div className="p-6 pb-0 flex items-center gap-2">
                <span className="text-xs text-slate-500">교재 선택</span>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={selectedTextbookId ?? ""}
                  onChange={(e) => {
                    const nextId = e.target.value || null; // string 그대로
                    const tb = textbooks.find((t) => String(t.textbook_id ?? t.id) === nextId);
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
                  <span className="ml-2 text-xs text-slate-500">버전 {selectedVersion}</span>
                )}
              </div>

              {/* 상단 타이틀/설명 */}
              <div className="p-6 pt-4">
                <h2 className="text-2xl font-extrabold text-slate-900">
                  {currentSection?.title || "교재를 선택해 주세요."}
                </h2>
                <p className="text-slate-600 mt-1">{currentSection?.desc || ""}</p>
              </div>

              {/* 본문 */}
              <div className="p-6 space-y-8">
                {currentPage ? (
                  <article className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900">
                      {currentPage.page_number ?? pageIndex + 1} 페이지
                    </h3>
                    <div className="mt-3 border rounded-xl min-h-[280px] px-3 py-2 bg-white">
                      <BlockNoteView editor={editor} theme="light" editable={false} />
                    </div>
                  </article>
                ) : (
                  <p className="text-sm text-slate-500">표시할 페이지가 없습니다.</p>
                )}
              </div>

              {/* 페이지 네비 */}
              <div className="p-4 flex items-center justify-center gap-4">
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#13A4EC] text-white shadow-sm disabled:opacity-50 cursor-pointer disabled:cursor-default"
                  onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                  disabled={pageIndex <= 0}
                >
                  이전
                </button>
                <div className="min-w-[120px] text-center text-slate-700 font-semibold">
                  {pages.length ? pageIndex + 1 : 0} / {pages.length}
                </div>
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#13A4EC] text-white shadow-sm disabled:opacity-50 cursor-pointer disabled:cursor-default"
                  onClick={() => setPageIndex((p) => Math.min(totalPage - 1, p + 1))}
                  disabled={pageIndex >= totalPage - 1}
                >
                  다음
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
