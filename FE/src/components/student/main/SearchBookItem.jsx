import DummyProgressBar from "../../DummyProgressBar";

/**
 * SearchBookItem Component
 * @param {string} title - 교재 제목
 * @param {string} subject - 교재 주제
 * @param {string} term - 교재 학기
 * @returns {JSX.Element}
 */
const SearchBookItem = ({ title, subject, term }) => {
  return (
    <div className="flex flex-col w-[320px] h-[242px] rounded-[16px] border border-[#E2E8F0]">
      <div className="w-full h-[112px] bg-gray-200 bg-center bg-cover"></div>
      <div className="flex flex-col gap-[4px] flex-1 min-h-0 p-[16px]">
        <p className="text-[16px] font-semibold text-[#0F172A]">{title}</p>
        <p className="text-[14px] text-[#64748B]">
          {subject} · {term}
        </p>
        <DummyProgressBar />
        <div className="flex items-center gap-[8px] pt-[10px]">
          <button className="text-[14px] text-[#13A4EC] font-semibold cursor-pointer">
            열기
          </button>
          <span className="text-[16px] text-[#64748B]">·</span>
          <button className="text-[14px] text-[#13A4EC] font-semibold cursor-pointer">
            퀴즈
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBookItem;
