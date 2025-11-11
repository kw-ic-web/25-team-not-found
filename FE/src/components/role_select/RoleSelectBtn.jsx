import { twMerge } from "tailwind-merge";

const RoleSelectBtn = ({ className, src, title, content, ...props }) => {
  return (
    <button
      className={twMerge(
        "group flex flex-col gap-[24px] justify-center items-center w-[430px] h-[240px] bg-white rounded-[12px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.10)] cursor-pointer hover:bg-[#13A4EC]",
        className
      )}
      {...props}
    >
      <div className="group-hover:hidden flex justify-center items-center size-[64px] bg-[#13A4EC]/10 rounded-[8px]">
        <img className="w-[36px] h-[44px]" src={src} alt="" />
      </div>

      <div className="group-hover:hidden flex flex-col gap-[8px] px-[52px]">
        <p className="text-[24px] font-bold text-[#0F172A]">{title}</p>
        <p className="text-[16px] text-[#64748B]">{content}</p>
      </div>

      {/* hover 시 나타나는 부분 */}
      <span className="hidden group-hover:block text-[18px] font-bold text-white">
        {title} 선택
      </span>
    </button>
  );
};

export default RoleSelectBtn;
