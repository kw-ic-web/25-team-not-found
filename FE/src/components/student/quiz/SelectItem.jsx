const SelectItem = ({ children }) => {
  return (
    <button className="flex items-center gap-[16px] py-[20px] px-[18px] w-full h-[60px] border border-[#E2E8F0] rounded-[12px] cursor-pointer">
      <div className="size-[20px] bg-[#F6F7F8] border border-[#E2E8F0] rounded-full"></div>
      <p className="text-[16px]">{children}</p>
    </button>
  );
};

export default SelectItem;
