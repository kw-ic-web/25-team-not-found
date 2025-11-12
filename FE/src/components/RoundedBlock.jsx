import { twMerge } from "tailwind-merge";

/**
 * RoundedBlock Component
 * @param {string} className - Additional CSS classes
 * @param {string} title - 검은색 제목
 * @param {ReactNode} rightElement - 오른쪽에 위치하는 요소
 * @param {ReactNode} children
 * @param {Object} props
 * @returns {JSX.Element}
 */
const RoundedBlock = ({
  className = "",
  title,
  rightElement,
  children,
  ...props
}) => {
  const base =
    "p-[25px] w-[512px] h-[353px] rounded-[16px] bg-white border border-[#E2E8F0] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]";
  return (
    <div className={twMerge(base, className)} {...props}>
      <div className="flex justify-between w-full">
        <h2 className="text-[18px] font-bold text-[#0F172A]">{title}</h2>
        {rightElement}
      </div>
      {children}
    </div>
  );
};

export default RoundedBlock;
