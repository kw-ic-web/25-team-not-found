import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TextbookSelectModal({
  open,
  onClose,
  onConfirm,
  textbooks: propTextbooks,
}) {
  const navigate = useNavigate();

  const textbooks = Array.isArray(propTextbooks) ? propTextbooks : [];
  console.log("[TextbookSelectModal] textbooks prop:", propTextbooks);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (textbooks.length > 0) {
      setSelectedId(textbooks[0].textbook_id ?? textbooks[0].id);
    } else {
      setSelectedId(null);
    }
  }, [textbooks]);

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
    return list;
  }, [search, sort, textbooks]);

  const selectedBook =
    filtered.find(
      (b) => String(b.textbook_id ?? b.id) === String(selectedId)
    ) || null;

  if (!open) return null;

  const handleConfirm = () => {
    if (!selectedBook) return;

    const textbookId = selectedBook.textbook_id ?? selectedBook.id;

    const payload = {
      textbookId,
      textbookTitle: selectedBook.title,
      title: selectedBook.title,
      subject: selectedBook.subject,
      meta: selectedBook.meta,
      raw: selectedBook,
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
      <div className="w-[768px] max-w-[768px] rounded-2xl bg-white border border-slate-200 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] p-6">
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

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-500"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 flex items-center gap-3">
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

          <div className="relative w-[144px] h-[38px]">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full h-full rounded-lg border border-slate-300 bg-white px-3 pr-8 text-[14px] text-slate-800 appearance-none outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
            >
              <option value="recent">최근 사용 순</option>
              <option value="title">제목 순</option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 border border-slate-500 border-l-0 border-t-0 rotate-45" />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {filtered.map((book) => {
            const bookKey = book.textbook_id ?? book.id;
            const isActive = String(bookKey) === String(selectedId);

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
                <div className="w-full h-24 bg-slate-100 rounded-md" />

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

          {filtered.length === 0 && (
            <div className="col-span-full py-8 text-center text-sm text-slate-500 border border-dashed border-slate-300 rounded-lg">
              표시할 교재가 없습니다. 먼저 교재를 생성해 주세요.
            </div>
          )}
        </div>

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
