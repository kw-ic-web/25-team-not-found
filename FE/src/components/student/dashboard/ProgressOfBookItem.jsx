import { twMerge } from "tailwind-merge";
import DummyProgressBar from "../../DummyProgressBar";

/**
 * @param {string} title
 * @param {string} progress   ex) "75%"
 * @param {function} onOpen
 */
const ProgressOfBookItem = ({ title, progress, onOpen }) => {
  return (
    <div className="flex justify-between items-start w-full p-[16px] rounded-[16px] border border-[#E2E8F0] bg-white">
      <div className="flex flex-col gap-[6px] w-full pr-[16px]">
        <p className="text-[16px] font-bold text-[#0F172A]">{title}</p>
        <p className="text-[12px] text-[#64748B]">{progress} 완료</p>
        <div className="mt-[6px]">
          <DummyProgressBar value={Number(String(progress).replace("%", "")) || 0} />
        </div>
      </div>
      <button
        type="button"
        onClick={onOpen}
        className={twMerge(
          "inline-flex items-center whitespace-nowrap text-[14px] text-[#13A4EC] font-semibold cursor-pointer",
          "hover:underline"
        )}
      >
        교재 열기
      </button>
    </div>
  );
};

export default ProgressOfBookItem;