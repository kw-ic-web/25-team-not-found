// FE/src/pages/TeacherLecture.jsx
import { useState } from "react";
import TextbookSelectModal from "../components/teacher/TextbookSelectModal";
import ic_logo from "../assets/icons/ic_logo.svg";

export default function TeacherLecture() {
  const [isTextbookModalOpen, setIsTextbookModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  return (
    <div className="min-h-screen bg-[#F6F7F8] flex flex-col">
      {/* Header */}
      <header className="h-[65px] bg-white border-b border-slate-200">
  <div className="mx-auto max-w-[1746px] h-full px-6 flex items-center justify-between">
    {/* 왼쪽: 로고 + 상태 */}
    <div className="flex items-center gap-4">
      {/* 로고 부분 */}
      <div className="flex items-center gap-2">
        <img
          src={ic_logo}
          alt="EduNote logo"
          className="w-8 h-8 rounded-md"
        />
        <span className="text-[20px] font-bold text-slate-800">EduNote</span>
      </div>

      {/* 실시간 연결 준비 */}
      <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
        <div className="w-6 h-6 rounded-full bg-[#EF4444]" />
        <span className="text-[14px] font-medium text-slate-500">
          실시간 연결 준비
        </span>
      </div>
    </div>

    {/* 오른쪽: 대시보드 버튼 + 프로필 동그라미 */}
    <div className="flex items-center gap-3">
      <button className="h-10 px-4 rounded-lg border border-slate-300 bg-white text-[14px] text-slate-900">
        대시보드
      </button>
      <div className="w-10 h-10 rounded-full bg-slate-200" />
    </div>
  </div>
</header>


      {/* Main */}
<main className="flex-1 flex items-center justify-center py-10">
  <div className="max-w-[1536px] w-full px-6 flex flex-col lg:flex-row gap-6">
    {/* Left: 수업 준비 영역 */}
    <section className="flex-1 bg-white rounded-lg shadow-sm p-8 flex flex-col gap-4">
      <div>
        <h2 className="text-[20px] font-bold text-slate-900">
          수업 준비 중
        </h2>
        <p className="mt-1 text-[14px] text-slate-600">
          화상통화 연결이 완료되었습니다. 수업에 사용할 교재를 선택해주세요.
        </p>
      </div>

      {/* 선택된 교재 없음 박스 */}
      <div className="mt-4 border border-dashed border-slate-300 rounded-xl px-10 py-12 flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-4">
          

          <p className="max-w-[335px] text-center text-[16px] leading-6 text-slate-600">
            현재 선택된 교재가 없습니다. 아래 버튼을 눌러 수업에 사용할
            교재를 선택하세요.
          </p>
        </div>

        {/* 교재 선택하기 버튼 */}
        <button
  type="button"
  onClick={() => setIsTextbookModalOpen(true)}
  className="inline-flex items-center gap-2 px-5 h-11 rounded-lg bg-[#13A4EC] text-white text-[16px] font-bold shadow-sm"
>
  <span className="text-lg font-bold leading-none text-white">+</span>
  <span>교재 선택하기</span>
</button>

      </div>

            {/* 선택된 교재 표시 */}
            <div className="mt-4 text-[12px] text-slate-500">
              선택된 교재:{" "}
              <span className="font-medium">
                {selectedBook ? selectedBook.title : "없음"}
              </span>
            </div>
          </section>

          {/* Right: 화상 통화 영역 */}
          <aside className="w-full lg:w-[480px] bg-white rounded-lg shadow-sm p-6 flex flex-col gap-4">
            <h3 className="text-[18px] font-bold text-slate-900">화상 통화</h3>

            <div className="flex flex-col gap-4 flex-1">
              {/* 선생님 화면 */}
              <div className="relative w-full h-[243px] rounded-lg bg-slate-900">
                <div className="absolute left-2 bottom-2 px-2 py-0.5 rounded bg-black/60">
                  <span className="text-[12px] text-white">선생님</span>
                </div>
              </div>

              {/* 나 화면 */}
              <div className="relative w-full h-[243px] rounded-lg bg-slate-800">
                <div className="absolute left-2 bottom-2 px-2 py-0.5 rounded bg-black/60">
                  <span className="text-[12px] text-white">나</span>
                </div>
              </div>

              {/* 하단 컨트롤 버튼들 */}
              <div className="mt-2 flex items-center justify-center gap-3">
                <button className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center">
                  <span className="w-6 h-7 bg-slate-800 rounded" />
                </button>
                <button className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center">
                  <span className="w-6 h-7 bg-slate-800 rounded" />
                </button>
                <button className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
                  <span className="w-6 h-7 bg-white rounded" />
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* 교재 선택 모달 */}
      <TextbookSelectModal
        open={isTextbookModalOpen}
        onClose={() => setIsTextbookModalOpen(false)}
        onConfirm={(book) => {
          setSelectedBook(book);
          setIsTextbookModalOpen(false);
        }}
      />
    </div>
  );
}
