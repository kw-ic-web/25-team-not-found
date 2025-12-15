import RoundedBlock from "../../components/RoundedBlock";

const ProgressOfBookItem = ({ title, progress = "0%", onOpen }) => {
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
          <div
            className="h-full bg-[#13A4EC]"
            style={{
              width: `${Math.max(0, Math.min(100, parseFloat(progress))) || 0}%`,
            }}
          />
        </div>
      </div>
    </RoundedBlock>
  );
};

export default ProgressOfBookItem;