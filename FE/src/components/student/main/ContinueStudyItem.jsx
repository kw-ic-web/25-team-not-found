import DummyProgressBar from "../../DummyProgressBar";

const ContinueStudyItem = ({ children }) => {
  return (
    <div className="flex items-center gap-[12px] p-[12px]">
      <div className="size-[48px] rounded-[8px] bg-gray-200 bg-center bg-cover"></div>
      <div className="flex flex-col gap-[4px] flex-1 min-w-0 py-[10px]">
        <p className="text-[14px] font-semibold text-[#0F172A]">{children}</p>
        <DummyProgressBar />
      </div>
      <button className="text-[14px] text-[#13A4EC] font-semibold whitespace-nowrap cursor-pointer">
        계속하기 →
      </button>
    </div>
  );
};

export default ContinueStudyItem;
