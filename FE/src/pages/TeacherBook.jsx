import { useEffect, useState } from "react";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { ko } from "@blocknote/core/locales";
import "@blocknote/core/style.css";
import "@blocknote/mantine/style.css";
import api from "../api/api";
import SectionList from "../components/editor/SectionList";
import Dialog from "@mui/material/Dialog";
import TeacherQuiz from "./TeacherQuiz";
import { useLocation } from "react-router-dom";

export default function TeacherBook() {
  const location = useLocation();
  const { textbookId = 1, latestVersion = 1 } = location.state || {};

  const [pages, setPages] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [quizzesByPage, setQuizzesByPage] = useState({}); // page_id -> quizzes[]

  // 에디터 상태
  const [title, setTitle] = useState("새 교재");
  const [preview, setPreview] = useState(false);
  // const [status, setStatus] = useState("임시 저장됨");

  const editor = useCreateBlockNote({ dictionary: ko });

  const [openCreateQuiz, setOpenCreateQuiz] = useState(false);
  // 초기 fetch
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // 페이지 목록 로드
  useEffect(() => {
    (async () => {
      try {
        // response: { page_id, page_number, content }
        const { data } = await api.get(`/textbooks/${textbookId}/versions/${latestVersion}/pages`);
        setPages(
          data.map((p) => ({
            id: p.page_id,
            title: `Page ${p.page_number}`,
            pageNumber: p.page_number,
            // content는 이미 JSON 객체/배열로 반환됨 (JSONB 타입)
            content: p.content || [],
          }))
        );
        if (data?.[0]) {
          setCurrentId(data[0].page_id);
        }
        setIsInitialLoad(false);
      } catch {
        console.error("ERROR: load textbook pages failed");
        setIsInitialLoad(false);
      }
    })();
  }, [latestVersion, textbookId]);

  // 특정 페이지의 퀴즈 목록을 로드하는 함수
  const loadQuizzesForPage = async (pageId) => {
    try {
      const { data } = await api.get(`/quiz-managements/${pageId}`);
      // 중복 제거: 같은 quiz_id를 가진 항목들을 그룹화
      const quizMap = {};
      data.forEach((item) => {
        if (!quizMap[item.quiz_id]) {
          quizMap[item.quiz_id] = {
            quiz_id: item.quiz_id,
            title: item.title,
            created_at: item.created_at,
            questions: [],
          };
        }
        quizMap[item.quiz_id].questions.push({
          question_id: item.question_id,
          question_type: item.question_type,
          question_content: item.question_content,
          options: item.options,
          correct_answer: item.correct_answer,
          explanation: item.explanation,
          question_order: item.question_order,
        });
      });
      return Object.values(quizMap);
    } catch (error) {
      console.error(`ERROR: load quizzes for page ${pageId} failed:`, error);
      return [];
    }
  };

  // 각 페이지의 퀴즈 목록 로드 (캐싱 적용)
  useEffect(() => {
    if (pages.length === 0) return;

    (async () => {
      const quizzesMap = { ...quizzesByPage }; // 기존 데이터 유지
      const pagesToLoad = pages.filter((page) => !(page.id in quizzesByPage));

      // 이미 로드된 페이지는 스킵하고, 새로 추가된 페이지만 로드
      for (const page of pagesToLoad) {
        quizzesMap[page.id] = await loadQuizzesForPage(page.id);
      }

      // 새로 로드된 데이터가 있을 때만 업데이트
      if (pagesToLoad.length > 0) {
        setQuizzesByPage(quizzesMap);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages.map((p) => p.id).join(",")]); // 페이지 ID 목록이 변경될 때만 실행

  // 현재 섹션이 변경될 때 해당 섹션의 content를 에디터에 로드
  useEffect(() => {
    if (!currentId) return;
    const currentSection = pages.find((s) => s.id === currentId);
    if (currentSection && currentSection.content) {
      try {
        // content는 이미 배열로 저장되어 있음 (JSONB 타입)
        const blocks = Array.isArray(currentSection.content)
          ? currentSection.content
          : typeof currentSection.content === "string"
          ? JSON.parse(currentSection.content)
          : [];
        editor.replaceBlocks(editor.document, blocks);
      } catch {
        // content가 유효한 JSON이 아니거나 비어있는 경우
        editor.replaceBlocks(editor.document, []);
      }
    } else {
      editor.replaceBlocks(editor.document, []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId]); // sections를 의존성에서 제거하여 타이핑 시 리셋 방지

  // 제목 변경 시 debounce로 자동 저장
  useEffect(() => {
    // 초기 fetch 시에는 호출하지 않음
    if (!textbookId || isInitialLoad) return;

    const timer = setTimeout(async () => {
      try {
        await api.put(`/textbooks/${textbookId}`, {
          title: title,
        });
      } catch {
        console.error("ERROR: edit book title failed");
      }
    }, 1500); // 1.5초 후 호출

    return () => clearTimeout(timer);
  }, [title, textbookId, isInitialLoad]);

  const handleSave = async () => {
    try {
      // 모든 페이지에 대해 PUT만 호출 (업데이트)
      for (let i = 0; i < pages.length; ++i) {
        const page = pages[i];

        // 임시 ID인 경우 스킵 (아직 서버에 생성되지 않은 페이지)
        if (page.id && page.id.startsWith("s")) {
          console.warn(`Skipping page with temporary ID: ${page.id}`);
          continue;
        }

        // content를 JSON 문자열로 변환 (백엔드가 JSONB로 저장)
        const contentToSend = page.content ? JSON.stringify(page.content) : null;

        await api.put(`/textbooks/${textbookId}/versions/${latestVersion}/pages/${page.id}`, {
          content: contentToSend,
        });
      }
      console.log("저장 완료");
      // setStatus("저장 완료");
    } catch (error) {
      console.error("저장 실패:", error);
      if (error.response) {
        console.error("응답 데이터:", error.response.data);
        console.error("상태 코드:", error.response.status);
      }
      // setStatus("저장 실패");
    }
  };

  const addSection = async () => {
    try {
      // POST로 새 페이지 생성
      const pageNumber = pages.length + 1;
      const { data } = await api.post(`/textbooks/${textbookId}/versions/${latestVersion}/pages`, {
        page_number: pageNumber,
        content: null,
      });

      // 응답으로 받은 page_id를 사용하여 페이지 추가
      const created = {
        id: data.page_id,
        title: `Page ${data.page_number}`,
        pageNumber: data.page_number,
        content: null,
      };
      setPages((prev) => [...prev, created]);
      setCurrentId(created.id);
      editor.replaceBlocks(editor.document, []);
    } catch {
      console.error("ERROR: create page failed");
    }
  };

  const deleteSection = async (pageId) => {
    if (!pageId) return;
    if (!confirm("현재 섹션을 삭제할까요?")) return;

    try {
      await api.delete(`/textbooks/${textbookId}/versions/${latestVersion}/pages/${pageId}`);

      setPages((prev) => prev.filter((x) => x.id !== pageId));
      const rest = pages.filter((x) => x.id !== pageId);
      if (rest[0]) {
        setCurrentId(rest[0].id);
      } else {
        setCurrentId(null);
        setTitle("");
      }
      // 퀴즈 목록도 업데이트
      setQuizzesByPage((prev) => {
        const updated = { ...prev };
        delete updated[pageId];
        return updated;
      });
    } catch (error) {
      console.error("ERROR: delete page failed", error);
      if (error.response) {
        console.error("응답 데이터:", error.response.data);
      }
    }
  };

  return (
    <div className="flex h-[calc(100vh-0px)] bg-slate-50">
      {/* SectionList 사이드 바 */}
      <SectionList
        sections={pages}
        currentId={currentId}
        onSelect={setCurrentId}
        onAdd={addSection}
        onDelete={deleteSection}
        setOpenCreateQuiz={setOpenCreateQuiz}
        quizzesByPage={quizzesByPage}
      />

      <Dialog
        open={openCreateQuiz}
        onClose={() => {
          setOpenCreateQuiz(false);
        }}
        maxWidth={false}
      >
        <TeacherQuiz
          onClose={async () => {
            setOpenCreateQuiz(false);
            // 퀴즈 생성 후 현재 페이지의 퀴즈 목록 새로고침
            if (currentId) {
              const quizzes = await loadQuizzesForPage(currentId);
              setQuizzesByPage((prev) => ({
                ...prev,
                [currentId]: quizzes,
              }));
            }
          }}
          textbookId={textbookId}
          version={latestVersion}
          pageNumber={pages.find((p) => p.id === currentId)?.pageNumber}
        />
      </Dialog>

      {/* 우측 */}
      <div className="flex-1 flex flex-col">
        {/* 상단 헤더 좌측 제목, 우측 버튼 */}
        <div className="w-full bg-white border-b border-slate-200">
          <div className="mx-auto max-w-[1200px] h-14 px-6 flex items-center justify-between">
            <div className="px-6 pt-5 pb-3 border-b border-slate-200">
              <input
                className="w-full text-xl font-semibold outline-none border-0 focus:outline-none focus:ring-0 text-slate-800 placeholder:text-slate-400"
                value={title}
                onChange={(e) => {
                  const v = e.target.value;
                  setTitle(v);
                  setPages((prev) =>
                    prev.map((s) => (s.id === currentId ? { ...s, title: v } : s))
                  );
                }}
                placeholder="제목을 입력하세요"
              />
            </div>
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
          <div className="mx-auto w-[896px] px-6 py-8">
            <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200">
              {/* 본문*/}
              <div className="px-6 py-6 min-h-[448px]">
                <BlockNoteView
                  editor={editor}
                  theme="light"
                  editable={!preview}
                  onChange={() => {
                    // JSON 객체로 직접 저장
                    const newContent = editor.document;
                    // 현재 섹션의 content 업데이트
                    if (currentId) {
                      setPages((prev) =>
                        prev.map((s) => (s.id === currentId ? { ...s, content: newContent } : s))
                      );
                    }
                  }}
                />
              </div>
            </div>

            {/* 페이지 네비게이션 */}
            {/* <div className="mt-4 flex items-center justify-center gap-4">
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
            </div> */}

            {/* 상태 표시 */}
            {/* <div className="mt-4 text-center text-xs text-emerald-600">상태: {status}</div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
