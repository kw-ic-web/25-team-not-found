import { twJoin } from "tailwind-merge";

const SelectItem = ({ children, isSelected = false, ...props }) => {
  return (
    <button
      className={twJoin(
        "flex items-center gap-[16px] py-[20px] px-[18px] w-full h-[60px] border rounded-[12px] cursor-pointer",
        isSelected ? "border-[#13A4EC]" : "border-[#E2E8F0]"
      )}
      {...props}
    >
      <div className="size-[20px] bg-[#F6F7F8] border border-[#E2E8F0] rounded-full"></div>
      <p className="text-[16px]">{children}</p>
    </button>
  );
};

export default SelectItem;
