import clsx from "clsx";

const QuizItem = ({ title, isSelected = false, ...props }) => {
  return (
    <button
      className={clsx(
        "flex items-center gap-[12px] p-[12px] w-full h-[64px] rounded-[12px] cursor-pointer",
        isSelected && "bg-[#13A4EC]/10"
      )}
      {...props}
    >
      <div className="size-[40px] bg-gray-200 bg-cover bg-center rounded-[12px]"></div>
      <p
        className={clsx(
          "text-[14px] font-semibold",
          isSelected ? "text-[#13A4EC]" : "text-[#0D1F29]"
        )}
      >
        {title}
      </p>
    </button>
  );
};

export default QuizItem;
