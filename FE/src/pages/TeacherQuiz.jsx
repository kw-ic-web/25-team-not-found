import { useState, useEffect } from "react";
import ic_logo from "../assets/icons/ic_logo.svg";
import api from "../api/api";

/**
 * 퀴즈 제작 페이지
 * @param props
 * @param {Dispatch<SetStateAction<boolean>> | (() => void)} props.onClose - `TeacherBook.jsx`에서 Dialog으로 띄웠을 경우 onClose 동작, 일반 페이지로 띄웠을 경우 Do Nothing.
 * @param {number} props.textbookId - 교재 ID
 * @param {number} props.version - 교재 버전
 * @param {number} props.pageNumber - 현재 페이지 번호
 * @returns
 */
export default function TeacherQuiz({ onClose = () => {}, textbookId, version = 1, pageNumber }) {
  const RESOLVED_TEXTBOOK_ID = textbookId ?? 1;

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [page, setPage] = useState(pageNumber ? String(pageNumber) : "");
  const [linkKey, setLinkKey] = useState("");
  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", ""],
      correctIndex: 0,
      explanation: "",
      type: "객관식",
      difficulty: 5,
    },
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // pageNumber prop이 변경되면 page state 업데이트
  useEffect(() => {
    if (pageNumber) {
      setPage(String(pageNumber));
    }
  }, [pageNumber]);

  const currentQuestion = questions[currentQuestionIndex];

  const updateCurrentQuestion = (updates) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === currentQuestionIndex ? { ...q, ...updates } : q))
    );
  };

  const addOption = () => {
    updateCurrentQuestion({
      options: [...currentQuestion.options, ""],
    });
  };

  const addNewQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        question: "",
        options: ["", ""],
        correctIndex: 0,
        explanation: "",
        type: "객관식",
        difficulty: 5,
      },
    ]);
    setCurrentQuestionIndex(questions.length);
  };

  const deleteQuestion = (index) => {
    if (questions.length <= 1) {
      alert("최소 1개의 문항이 필요합니다.");
      return;
    }
    setQuestions((prev) => prev.filter((_, i) => i !== index));
    if (currentQuestionIndex >= index && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentQuestionIndex >= questions.length - 1) {
      setCurrentQuestionIndex(questions.length - 2);
    }
  };

  const mapQuestionType = (t) => {
    if (t === "객관식") return "multiple_choice";
    if (t === "주관식") return "subjective";
    if (t === "OX") return "ox";
    return "multiple_choice";
  };

  const validateForm = () => {
    if (!title.trim()) {
      alert("퀴즈 제목을 입력해주세요.");
      return false;
    }
    if (!page.trim() && !pageNumber) {
      alert("교재 페이지 번호를 입력해주세요.");
      return false;
    }
    if (questions.length === 0) {
      alert("최소 1개 이상의 문항이 필요합니다.");
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        alert(`문항 ${i + 1}의 질문을 입력해주세요.`);
        return false;
      }

      const qt = mapQuestionType(q.type);
      const cleanOptions = q.options.map((o) => o.trim()).filter((o) => o !== "");

      if (qt === "multiple_choice") {
        if (cleanOptions.length < 2) {
          alert(`문항 ${i + 1}: 객관식 문항은 최소 2개 이상의 보기가 필요합니다.`);
          return false;
        }
        if (q.correctIndex < 0 || q.correctIndex >= cleanOptions.length) {
          alert(`문항 ${i + 1}: 정답으로 사용할 보기를 선택해주세요.`);
          return false;
        }
      }
    }

    return true;
  };

  const buildPayload = () => {
    const payloadQuestions = questions.map((q) => {
      const questionType = mapQuestionType(q.type);
      const cleanOptions = q.options.map((o) => o.trim()).filter((o) => o !== "");

      let correctAnswer = "";
      let payloadOptions = [];

      if (questionType === "multiple_choice") {
        payloadOptions = cleanOptions;
        correctAnswer = cleanOptions[q.correctIndex] ?? "";
      } else if (questionType === "ox") {
        payloadOptions = ["O", "X"];
        correctAnswer = "O"; // 추후 O/X
      } else {
        payloadOptions = [];
        correctAnswer = "";
      }

      return {
        question_type: questionType,
        question_content: q.question.trim(),
        options: payloadOptions,
        correct_answer: correctAnswer,
        explanation: q.explanation.trim(),
      };
    });

    // pageNumber prop이 있으면 우선 사용, 없으면 page state 사용
    const resolvedPageNumber = pageNumber || (page.trim() ? Number(page) : null);
    if (!resolvedPageNumber) {
      throw new Error("페이지 번호가 필요합니다.");
    }

    return {
      textbook_id: RESOLVED_TEXTBOOK_ID,
      version: Number(version) || 1,
      page_number: resolvedPageNumber,
      title: title.trim(),
      questions: payloadQuestions,
    };
  };

  const handlePublish = async () => {
    if (!validateForm()) return;
    try {
      setIsSaving(true);
      const payload = buildPayload();
      const { data } = await api.post("/quiz-managements", payload);
      console.log("퀴즈 발행 완료:", data);
      alert("퀴즈가 발행(저장)되었습니다.");

      onClose();
    } catch (err) {
      console.error("퀴즈 발행 실패:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "퀴즈 발행에 실패했습니다.";
      alert(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[1200px] h-[1200px] w-full bg-white">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 ">
        <div className="w-full h-16 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <img src={ic_logo} alt="EduNote" className="w-9 h-9 shrink-0" />
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 truncate">
              EduNote · 퀴즈 제작
            </h1>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              type="button"
              className="h-10 md:h-11 px-4 md:px-5 rounded-xl border border-gray-200 text-slate-900 text-sm md:text-base hover:bg-gray-50"
              onClick={onClose}
            >
              교재로 돌아가기
            </button>

            <button
              type="button"
              onClick={handlePublish}
              disabled={isSaving}
              className="h-10 md:h-11 px-5 md:px-6 rounded-xl bg-sky-500 text-white text-sm md:text-base font-semibold shadow-sm hover:bg-sky-600 active:bg-sky-700 disabled:opacity-60"
            >
              {isSaving ? "저장중..." : "저장"}
            </button>

            <button
              type="button"
              className="h-10 md:h-11 px-4 md:px-5 rounded-xl border border-gray-200 text-slate-900 text-sm md:text-base hover:bg-gray-50"
            >
              미리보기
            </button>
          </div>
        </div>
      </header>

      <main className="flex justify-center items-start gap-6 p-6 flex-1">
        <aside className="w-[608px] flex flex-col gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-bold text-slate-900">출제 근거 (교재)</h2>
              <div className="px-2 h-5 rounded-full bg-sky-500/10">
                <span className="text-[12px] font-semibold text-sky-500 leading-5">
                  {page ? `p. ${page}` : "p. -"}
                </span>
              </div>
            </div>

            <div className="max-h-56 overflow-auto">
              <p className="text-sm leading-6 text-slate-700">
                선택된 텍스트가 없습니다. 교재에서 영역을 선택 후 &quot;퀴즈 만들기&quot;를
                눌러보세요.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="space-y-1">
                <label className="text-[12px] text-slate-500">교재 페이지</label>
                <input
                  value={page}
                  onChange={(e) => setPage(e.target.value)}
                  className="h-[42px] w-full rounded-xl border border-gray-600 px-3 text-[16px] text-slate-900"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[12px] text-slate-500">문항 연결 키(선택)</label>
                <input
                  value={linkKey}
                  onChange={(e) => setLinkKey(e.target.value)}
                  placeholder="예: section-2-3"
                  className="h-[41px] w-full rounded-xl border border-gray-600 px-3 text-[16px] placeholder-gray-500"
                />
              </div>
            </div>

            <p className="text-[12px] text-slate-500">
              ※ 교재의 어느 부분에서 출제했는지 기록을 남겨 보세요.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
            <h3 className="text-[16px] font-semibold text-slate-900">교재 미리보기(요약)</h3>
            <div className="h-40 bg-slate-100 rounded-md grid place-items-center">
              <span className="text-[14px] text-slate-500">페이지 섬네일(예시)</span>
            </div>
          </div>
        </aside>

        <section className="w-[766px] flex flex-col gap-4">
          <div className="flex items-center justify-between h-[38px]">
            <h2 className="text-[24px] font-bold text-slate-900">문항 편집</h2>
            <button
              type="button"
              className="relative h-[38px] w-[88px] rounded-xl bg-sky-500 text-white text-[14px] font-semibold"
              onClick={addNewQuestion}
            >
              새 문항
            </button>
          </div>

          {/* 문항 목록 */}
          <div className="space-y-4">
            {questions.map((q, index) => (
              <div
                key={index}
                className={`bg-white border-2 rounded-2xl p-4 space-y-3 ${
                  currentQuestionIndex === index ? "border-sky-500" : "border-gray-200"
                }`}
                onClick={() => setCurrentQuestionIndex(index)}
              >
                <div className="flex items-start justify-between">
                  <span className="text-[18px] font-bold text-slate-900 hover:text-sky-500">
                    문항 {index + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="h-9 w-9 rounded-full hover:bg-gray-100 grid place-items-center"
                      title="복제"
                      disabled
                    >
                      <span className="block w-4 h-4 bg-slate-300 rounded-sm" />
                    </button>
                    <button
                      type="button"
                      className="h-9 w-9 rounded-full hover:bg-gray-100 grid place-items-center"
                      title="삭제"
                      onClick={() => deleteQuestion(index)}
                    >
                      <span className="block w-4 h-4 bg-slate-300 rounded-full" />
                    </button>
                  </div>
                </div>

                {currentQuestionIndex === index && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[14px] font-medium text-slate-900">질문</label>
                      <textarea
                        value={q.question}
                        onChange={(e) => updateCurrentQuestion({ question: e.target.value })}
                        placeholder="질문을 입력하세요."
                        className="h-[90px] w-full resize-none rounded-xl border border-gray-600 px-3 py-2 text-[16px] placeholder-gray-500"
                      />
                    </div>

                    <div className="space-y-2 pt-1">
                      <label className="text-[14px] font-medium text-slate-900">보기</label>
                      <div className="space-y-2">
                        {q.options.map((opt, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <input
                              type="radio"
                              className="size-4 rounded-full border border-gray-600"
                              checked={q.correctIndex === i}
                              onChange={() => updateCurrentQuestion({ correctIndex: i })}
                            />
                            <input
                              value={opt}
                              onChange={(e) =>
                                updateCurrentQuestion({
                                  options: q.options.map((v, idx) =>
                                    idx === i ? e.target.value : v
                                  ),
                                })
                              }
                              placeholder={`보기 ${i + 1}`}
                              className="h-[41px] flex-1 rounded-xl border border-gray-600 px-3 text-[16px] placeholder-gray-500"
                            />
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={addOption}
                        className="flex items-center gap-1 text-sky-500 font-semibold text-[14px]"
                      >
                        <span className="block w-4 h-4 rounded-sm bg-sky-500" />
                        보기 추가
                      </button>
                    </div>

                    <div className="space-y-1 pt-2">
                      <label className="text-[14px] font-medium text-slate-900">해설</label>
                      <textarea
                        value={q.explanation}
                        onChange={(e) => updateCurrentQuestion({ explanation: e.target.value })}
                        placeholder="정답에 대한 해설을 입력하세요."
                        className="h-[70px] w-full resize-none rounded-xl border border-gray-600 px-3 py-2 text-[14px] placeholder-gray-500"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2 h-[42px]">
                        <span className="text-[14px] font-medium text-slate-900">문항 유형</span>
                        <div className="relative w-[120px] h-[42px]">
                          <select
                            value={q.type}
                            onChange={(e) => updateCurrentQuestion({ type: e.target.value })}
                            className="h-[42px] w-full rounded-xl border border-gray-600 px-3 text-[16px] text-slate-900"
                          >
                            <option>객관식</option>
                            <option>주관식</option>
                            <option>OX</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 h-5">
                        <span className="text-[14px] text-slate-500">난이도</span>
                        <input
                          type="range"
                          min={1}
                          max={10}
                          value={q.difficulty}
                          onChange={(e) =>
                            updateCurrentQuestion({ difficulty: Number(e.target.value) })
                          }
                          className="w-28"
                        />
                        <span className="w-6 text-center text-[14px] font-semibold text-slate-900">
                          {q.difficulty}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        <aside className="w-[450px] flex flex-col">
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
            <h2 className="text-[18px] font-bold text-slate-900">퀴즈 정보</h2>

            <div className="space-y-1">
              <label className="text-[14px] font-medium text-slate-900">퀴즈 제목</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-[42px] w-full rounded-xl border border-gray-600 px-3 text-[16px] text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[14px] font-medium text-slate-900">설명</label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="h-[90px] w-full resize-none rounded-xl border border-gray-600 px-3 py-2 text-[16px] text-slate-900"
              />
            </div>

            <div className="pt-5 border-t border-gray-200 space-y-2">
              <button
                type="button"
                onClick={handlePublish}
                disabled={isSaving}
                className="h-10 w-full rounded-xl bg-sky-500 text-white text-[16px] font-semibold disabled:opacity-60"
              >
                {isSaving ? "발행중..." : "퀴즈 발행"}
              </button>
              <button
                type="button"
                onClick={handlePublish}
                disabled={isSaving}
                className="h-[42px] w-full rounded-xl border border-gray-200 text-[16px] font-semibold text-slate-900 disabled:opacity-60"
              >
                임시 저장
              </button>
              <button
                type="button"
                className="h-10 w-full rounded-xl grid place-items-center hover:bg-gray-50"
              >
                <div className="flex items-center gap-2 text-slate-600 font-semibold text-[16px]">
                  <span className="block w-6 h-6 rounded bg-slate-600/80" />
                  미리보기
                </div>
              </button>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
