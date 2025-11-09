import RoundedBlock from "../../RoundedBlock";
import DummyProgressBar from "../../DummyProgressBar";

/**
 * 교재별 진도
 * @param {string} title - 교재 이름
 * @param {string} progress - 완료율 (75%)
 * @returns {JSX.Element}
 */
const ProgressOfBookItem = ({ title, progress }) => {
  return (
    <RoundedBlock className="p-[17px] w-full h-[98px]">
      <div className="flex flex-col gap-[12px]">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[16px] font-semibold text-[#0F172A]">{title}</p>
            <p className="text-[12px] text-[#64748B]">{progress} 완료</p>
          </div>
          <button className="text-[14px] text-[#13A4EC] cursor-pointer">
            단원 보기
          </button>
        </div>
        <DummyProgressBar />
      </div>
    </RoundedBlock>
  );
};

export default ProgressOfBookItem;
