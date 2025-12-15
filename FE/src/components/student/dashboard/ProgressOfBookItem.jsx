import RoundedBlock from "../../RoundedBlock";

/**
 * 교재별 진도
 * @param {string} title
 * @param {string} progress - 완료율 (75%)
 * @returns {JSX.Element}
 */
const ProgressOfBookItem = ({ title, progress = "0%", onOpen }) => {
  const pct = Math.max(0, Math.min(100, Number.parseFloat(progress) || 0));

  return (
    <RoundedBlock className="p-[17px] w-full">
      <div className="flex flex-col gap-[12px]">
        <div className="flex justify-between items-center gap-[16px]">
          <div className="min-w-0">
            <p className="text-[16px] font-semibold text-[#0F172A] truncate">{title}</p>
            <p className="text-[12px] text-[#64748B]">{progress} 완료</p>
          </div>
          <button
            type="button"
            onClick={onOpen}
            className="text-[14px] text-[#13A4EC] cursor-pointer font-semibold whitespace-nowrap"
          >
            교재 열기
          </button>
        </div>
        <div className="w-full h-[6px] bg-[#EEF2F6] rounded-full overflow-hidden">
          <div className="h-full bg-[#13A4EC]" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </RoundedBlock>
  );
};

export default ProgressOfBookItem;