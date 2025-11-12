import { twJoin, twMerge } from "tailwind-merge";
import RoundedBlock from "../../RoundedBlock";

/**
 * 내 학습 대시보드 가장 위 블록
 * @param {string} className - Additional CSS classes
 * @param {string} title - 회색 제목
 * @param {string} value - 값
 * @param {string} diff - 차이 값: -2.5%, +7.6%. -/+ 여부에 따라 색 변경
 * @param {Object} props - 추가 props
 * @returns {JSX.Element}
 */
const DiffRoundedBlock = ({ className, title, value, diff, ...props }) => {
  let color = "";
  if (diff[0] === "+") {
    color = "text-[#10B981]";
  } else if (diff[0] === "-") {
    color = "text-[#EF4444]";
  }
  return (
    <RoundedBlock
      className={twMerge(
        "flex flex-col gap-[4px] p-[17px] size-[140px]",
        className
      )}
      {...props}
    >
      <p className="text-[12px] text-[#64748B]">{title}</p>
      <p className="text-[30px] font-extrabold text-[#1F2937]">{value}</p>
      <p className={twJoin("text-[11px]", color)}>
        지난 기간 대비
        <br />
        {diff}
      </p>
    </RoundedBlock>
  );
};

export default DiffRoundedBlock;
