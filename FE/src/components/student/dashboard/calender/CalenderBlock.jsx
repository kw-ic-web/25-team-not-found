import { twMerge } from "tailwind-merge";

/**
 * 달력 블록 component
 * @param {string} className - Additional CSS classes
 * @param {string} type - 0: 자리 채우기용, 1: 낮음, 2: 중간, 3: 높음
 * @returns {JSX.Element}
 */
const CalenderBlock = ({ className, type }) => {
  let color = "";
  if (type === 0) {
    color = "bg-white";
  } else if (type === 1) {
    color = "bg-[#E2E8F0]";
  } else if (type === 2) {
    color = "bg-[#13A4EC]/40";
  } else if (type === 3) {
    color = "bg-[#13A4EC]";
  }
  return (
    <div
      className={twMerge("size-[32px] rounded-[4px]", color, className)}
    ></div>
  );
};

export default CalenderBlock;
