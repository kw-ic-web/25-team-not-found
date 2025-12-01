// src/pages/TeacherQuiz.jsx
import { useState } from "react";
import ic_logo from "../assets/icons/ic_logo.svg";

export default function TeacherQuiz({ textbookId, version = 1 }) {
  const RESOLVED_TEXTBOOK_ID = textbookId ?? 1;

  const [title, setTitle] = useState("3장 개념 확인");
  const [desc, setDesc] = useState("세포 구조 핵심 개념 확인");
  const [page, setPage] = useState("");
  const [linkKey, setLinkKey] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [difficulty, setDifficulty] = useState(5);
  const [type, setType] = useState("객관식");
  const [correctIndex, setCorrectIndex] = useState(0);
  const [explanation, setExplanation] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const addOption = () => setOptions((prev) => [...prev, ""]);

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
    if (!question.trim()) {
      alert("문항 질문을 입력해주세요.");
      return false;
    }

    const qt = mapQuestionType(type);
    const cleanOptions = options.map((o) => o.trim()).filter((o) => o !== "");

    if (qt === "multiple_choice") {
      if (cleanOptions.length < 2) {
        alert("객관식 문항은 최소 2개 이상의 보기가 필요합니다.");
        return false;
      }
      if (correctIndex < 0 || correctIndex >= cleanOptions.length) {
        alert("정답으로 사용할 보기를 선택해주세요.");
        return false;
      }
    }

    return true;
  };

  const buildPayload = () => {
    const questionType = mapQuestionType(type);
    const cleanOptions = options.map((o) => o.trim()).filter((o) => o !== "");

    let correctAnswer = "";
    let payloadOptions = [];

    if (questionType === "multiple_choice") {
      payloadOptions = cleanOptions;
      correctAnswer = cleanOptions[correctIndex] ?? "";
    } else if (questionType === "ox") {
      payloadOptions = ["O", "X"];
      correctAnswer = "O"; // 추후 O/X 
    } else {
      payloadOptions = [];
      correctAnswer = "";
    }

    return {
      textbook_id: RESOLVED_TEXTBOOK_ID,
      version: Number(version) || 1,
      page_number: Number(page) || 1,
      title: title.trim(),
      questions: [
        {
          question_type: questionType,
          question_content: question.trim(),
          options: payloadOptions,
          correct_answer: correctAnswer,
          explanation: explanation.trim(),
        },
      ],
    };
  };

  const handleSaveDraft = async () => {
    if (!validateForm()) return;
    try {
      setIsSaving(true);
      const payload = buildPayload();
      const saved = await createQuiz(payload);
      console.log("퀴즈 임시 저장 완료:", saved);
      alert("퀴즈가 임시 저장되었습니다.");
    } catch (err) {
      console.error("퀴즈 임시 저장 실패:", err);
      alert("퀴즈 임시 저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!validateForm()) return;
    try {
      setIsSaving(true);
      const payload = buildPayload();
      const saved = await createQuiz(payload);
      console.log("퀴즈 발행 완료:", saved);
      alert("퀴즈가 발행(저장)되었습니다.");
    } catch (err) {
      console.error("퀴즈 발행 실패:", err);
      alert("퀴즈 발행에 실패했습니다.");
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
            >
              교재로 돌아가기
            </button>

            <button
              type="button"
              onClick={handleSaveDraft}
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
              <h2 className="text-[18px] font-bold text-slate-900">
                출제 근거 (교재)
              </h2>
              <div className="px-2 h-5 rounded-full bg-sky-500/10">
                <span className="text-[12px] font-semibold text-sky-500 leading-5">
                  {page ? `p. ${page}` : "p. -"}
                </span>
              </div>
            </div>

            <div className="max-h-56 overflow-auto">
              <p className="text-sm leading-6 text-slate-700">
                선택된 텍스트가 없습니다. 교재에서 영역을 선택 후
                &quot;퀴즈 만들기&quot;를 눌러보세요.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="space-y-1">
                <label className="text-[12px] text-slate-500">
                  교재 페이지
                </label>
                <input
                  value={page}
                  onChange={(e) => setPage(e.target.value)}
                  className="h-[42px] w-full rounded-xl border border-gray-600 px-3 text-[16px] text-slate-900"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[12px] text-slate-500">
                  문항 연결 키(선택)
                </label>
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
            <h3 className="text-[16px] font-semibold text-slate-900">
              교재 미리보기(요약)
            </h3>
            <div className="h-40 bg-slate-100 rounded-md grid place-items-center">
              <span className="text-[14px] text-slate-500">
                페이지 섬네일(예시)
              </span>
            </div>
          </div>
        </aside>

        <section className="w-[766px] flex flex-col gap-4">
          <div className="flex items-center justify-between h-[38px]">
            <h2 className="text-[24px] font-bold text-slate-900">문항 편집</h2>
            <button
              type="button"
              className="relative h-[38px] w-[88px] rounded-xl bg-sky-500 text-white text-[14px] font-semibold"
              onClick={() => {
                setQuestion("");
                setOptions(["", ""]);
                setCorrectIndex(0);
                setExplanation("");
              }}
            >
              새 문항
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="text-[18px] font-bold text-slate-900">문항 1</h3>
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
                  disabled
                >
                  <span className="block w-4 h-4 bg-slate-300 rounded-full" />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[14px] font-medium text-slate-900">
                질문
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="질문을 입력하세요."
                className="h-[90px] w-full resize-none rounded-xl border border-gray-600 px-3 py-2 text-[16px] placeholder-gray-500"
              />
            </div>

            <div className="space-y-2 pt-1">
              <label className="text-[14px] font-medium text-slate-900">
                보기
              </label>
              <div className="space-y-2">
                {options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="radio"
                      className="size-4 rounded-full border border-gray-600"
                      checked={correctIndex === i}
                      onChange={() => setCorrectIndex(i)}
                    />
                    <input
                      value={opt}
                      onChange={(e) =>
                        setOptions((prev) =>
                          prev.map((v, idx) =>
                            idx === i ? e.target.value : v
                          )
                        )
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
              <label className="text-[14px] font-medium text-slate-900">
                해설
              </label>
              <textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="정답에 대한 해설을 입력하세요."
                className="h-[70px] w-full resize-none rounded-xl border border-gray-600 px-3 py-2 text-[14px] placeholder-gray-500"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2 h-[42px]">
                <span className="text-[14px] font-medium text-slate-900">
                  문항 유형
                </span>
                <div className="relative w-[120px] h-[42px]">
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="absolute inset-0 appearance-none rounded-xl border border-gray-600 pl-3 pr-8 text-[16px] text-slate-900 bg-white"
                  >
                    <option>객관식</option>
                    <option>주관식</option>
                    <option>OX</option>
                  </select>
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 block w-6 h-6 border border-gray-600 rounded-sm" />
                </div>
              </div>

              <div className="flex items-center gap-2 h-5">
                <span className="text-[14px] text-slate-500">난이도</span>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={difficulty}
                  onChange={(e) => setDifficulty(Number(e.target.value))}
                  className="w-28"
                />
                <span className="w-6 text-center text-[14px] font-semibold text-slate-900">
                  {difficulty}
                </span>
              </div>
            </div>
          </div>
        </section>

        <aside className="w-[450px] flex flex-col">
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
            <h2 className="text-[18px] font-bold text-slate-900">퀴즈 정보</h2>

            <div className="space-y-1">
              <label className="text-[14px] font-medium text-slate-900">
                퀴즈 제목
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-[42px] w-full rounded-xl border border-gray-600 px-3 text-[16px] text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[14px] font-medium text-slate-900">
                설명
              </label>
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
                onClick={handleSaveDraft}
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
