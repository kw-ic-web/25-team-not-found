import clsx from "clsx";

const CourseItem = ({ title, subject, isSelected = false, ...props }) => {
  return (
    <button
      className={clsx(
        "flex gap-[12px] p-[12px] w-full h-[72px] rounded-[12px] cursor-pointer",
        isSelected && "bg-[#13A4EC]/10"
      )}
      {...props}
    >
      <div className="size-[48px] bg-gray-200 bg-cover bg-center rounded-[12px]"></div>
      <div className="flex flex-col justify-between items-start py-[6px]">
        <p
          className={clsx(
            "text-[14px] font-semibold",
            isSelected ? "text-[#13A4EC]" : "text-[#0D1F29]"
          )}
        >
          {title}
        </p>
        <p
          className={clsx(
            "text-[12px]",
            isSelected ? "text-[#13A4EC]/80" : "text-[#0D1F29]"
          )}
        >
          {subject}
        </p>
      </div>
    </button>
  );
};

export default CourseItem;
