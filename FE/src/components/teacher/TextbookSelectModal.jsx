import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TextbookSelectModal({
  open,
  onClose,
  onConfirm,
  textbooks: propTextbooks,
}) {
  const navigate = useNavigate();

  //  실제 교재 데이터가 상위 컴포넌트에서 내려오면 그걸 사용
  //    없으면 더미 데이터 사용 
  const fallbackTextbooks = [
    {
      id: 1,
      subject: "수학",
      title: "미적분학 입문 (TEST)",
      meta: "고등 · 1학기",
    },
    {
      id: 2,
      subject: "수학",
      title: "대수학 기초 (TEST)",
      meta: "중등 · 선행",
    },
    {
      id: 3,
      subject: "과학",
      title: "생물학 기초 (TEST)",
      meta: "고등 · 선택",
    },
  ];


  const textbooks =
    propTextbooks && propTextbooks.length > 0
      ? propTextbooks
      : fallbackTextbooks;

  // 🔹 검색 / 정렬 / 선택 상태
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const [selectedId, setSelectedId] = useState(
    () => textbooks[0]?.textbook_id ?? textbooks[0]?.id ?? null
  );

  const filtered = useMemo(() => {
    const q = search.trim();
    let list = textbooks;

    if (q) {
      list = list.filter((b) => {
        const subject = b.subject || "";
        const title = b.title || "";
        const meta = b.meta || "";
        return (
          title.includes(q) || subject.includes(q) || meta.includes(q)
        );
      });
    }

    if (sort === "title") {
      return [...list].sort((a, b) =>
        (a.title || "").localeCompare(b.title || "")
      );
    }
    // sort === "recent" → 정렬 안 함(서버에서 최근 순 내려온다고 가정)
    return list;
  }, [search, sort, textbooks]);

  // 선택된 교재 찾기 
  const selectedBook =
    filtered.find(
      (b) =>
        String(b.textbook_id ?? b.id) === String(selectedId)
    ) || null;

  // open 여부 체크
  if (!open) return null;

  const handleConfirm = () => {
    if (!selectedBook) return;

    // textbookId
    const textbookId = selectedBook.textbook_id ?? selectedBook.id;

    // 상위/라우터로 넘겨줄 payload
    const payload = {
      textbookId, 
      textbookTitle: selectedBook.title, // Lecture.jsx에서 location.state.textbookTitle 로 읽음

      // 참고용/디버깅용 필드들
      title: selectedBook.title,
      subject: selectedBook.subject,
      meta: selectedBook.meta,
      raw: selectedBook,

      // 역할/이름도 같이 넘기기 (기본: 선생님)
      role: "teacher",
      userName: "테스트용 선생님",

      debugMessage: `[TEST] TextbookSelectModal에서 navigate로 전달됨 / textbookId=${textbookId}`,
      debugAt: new Date().toISOString(),
    };

    console.log("[TextbookSelectModal] 선택 교재 payload:", payload);

    onConfirm?.(payload);

    navigate("/lecture", { state: payload });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {/* 모달 카드 */}
      <div className="w-[768px] max-w-[768px] rounded-2xl bg-white border border-slate-200 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] p-6">
        {/* 상단: 제목 + 닫기버튼 */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1 max-w-[435px]">
            <h3 className="text-[20px] leading-[28px] font-bold text-slate-900">
              수업에 사용할 교재 선택
            </h3>
            <p className="text-[14px] leading-[20px] text-slate-600">
              오늘 수업에서 사용할 교재를 선택하면, 해당 교재가 왼쪽 화면에
              로드됩니다.
            </p>
          </div>

          {/* 닫기 버튼 (X 아이콘 자리) */}
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-500"
          >
            ✕
          </button>
        </div>

        {/* 검색 + 정렬 영역 */}
        <div className="mt-5 flex items-center gap-3">
          {/* 검색 인풋 */}
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded bg-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-[41px] rounded-lg border border-slate-300 pl-9 pr-3 text-[16px] placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
              placeholder="교재 검색 (제목, 과목 등)"
            />
          </div>

          {/* 정렬 셀렉트 */}
          <div className="relative w-[144px] h-[38px]">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full h-full rounded-lg border border-slate-300 bg-white px-3 pr-8 text-[14px] text-slate-800 appearance-none outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
            >
              <option value="recent">최근 사용 순</option>
              <option value="title">제목 순</option>
            </select>
            {/* 드롭다운 화살표 */}
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 border border-slate-500 border-l-0 border-t-0 rotate-45" />
          </div>
        </div>

        {/* 교재 카드 리스트 */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {filtered.map((book) => {
            const bookKey = book.textbook_id ?? book.id;
            const isActive =
              String(bookKey) === String(selectedId);

            return (
              <button
                key={bookKey}
                type="button"
                onClick={() => setSelectedId(bookKey)}
                className={`flex flex-col items-stretch text-left rounded-lg ${
                  isActive
                    ? "border-2 border-[#13A4EC]"
                    : "border border-slate-200"
                } p-[2px] transition`}
              >
                {/* 썸네일 부분 */}
                <div className="w-full h-24 bg-slate-100 rounded-md" />

                {/* 텍스트 영역 */}
                <div className="mt-1 px-3 py-2 flex flex-col gap-1">
                  <span
                    className={`text-[12px] leading-4 ${
                      isActive
                        ? "font-bold text-[#13A4EC]"
                        : "text-slate-500"
                    }`}
                  >
                    {book.subject || "과목 미지정"}
                  </span>
                  <span className="text-[14px] font-bold text-slate-900">
                    {book.title}
                  </span>
                  <span className="text-[12px] text-slate-500">
                    {book.meta}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 하단: 선택 정보 + 버튼들 */}
        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="text-[12px] text-slate-500">
            선택된 교재:{" "}
            <span className="font-semibold text-slate-700">
              {selectedBook ? selectedBook.title : "없음"}
            </span>
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-[38px] px-4 rounded-lg border border-slate-300 bg-white text-[14px] text-slate-500"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!selectedBook}
              className="h-[38px] px-5 rounded-lg bg-[#13A4EC] text-[14px] font-bold text-white disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              이 교재로 수업 시작
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
