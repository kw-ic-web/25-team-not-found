import clsx from "clsx";

/**
 * StudentSidebar Button Component
 * @param {string} children - Button text
 * @param {ReactNode} Icon - Icon component
 * @param {boolean} isActivated - Whether the button is activated
 * @param {Object} props
 * @returns {JSX.Element}
 */
const SidebarBtn = ({ children, Icon, isActivated, ...props }) => {
  return (
    <button
      className={clsx(
        "flex items-center gap-[12px] w-full py-[6px] px-[12px] h-[40px] rounded-[8px] cursor-pointer",
        isActivated && "bg-[#13A4EC]/10"
      )}
      {...props}
    >
      {Icon && <Icon fill={isActivated ? "#13A4EC" : "#94A3B8"} />}
      <span
        className={clsx(
          "text-[16px] font-semibold",
          isActivated ? "text-[#13A4EC]" : "text-[#0F172A]"
        )}
      >
        {children}
      </span>
    </button>
  );
};

export default SidebarBtn;
