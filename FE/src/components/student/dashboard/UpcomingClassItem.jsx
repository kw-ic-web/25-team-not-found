import { twMerge } from "tailwind-merge";

/**
 * 다가오는 수업 item component
 * @param {string} className - Additional CSS classes
 * @param {string} title - 수업 이름
 * @param {string} subtitle - 교재 설명
 * @param {string} runtime - 총 수업 시간
 * @param {string} time - 수업 시간
 * @returns {JSX.Element}
 */
const UpcomingClassItem = ({ className, title, subtitle, runtime, time }) => {
  return (
    <div
      className={twMerge(
        "flex justify-between items-center w-full h-[64px]",
        className
      )}
    >
      <div>
        <p className="text-[16px] font-medium text-[#0F172A]">{title}</p>
        <p className="text-[12px] text-[#64748B]">
          {subtitle} · {runtime}
        </p>
      </div>
      <p className="text-[14px] text-[#0F172A]">{time}</p>
    </div>
  );
};

export default UpcomingClassItem;
