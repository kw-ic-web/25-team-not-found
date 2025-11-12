import ic_logo from "../assets/icons/ic_logo.svg";
import ic_dashboard from "../assets/navbar/ic_dashboard.svg";

const DefaultNavBar = () => {
  return (
    <nav className="flex justify-between items-center w-full h-[65px] px-[40px] border-b-[1px] border-[#E2E8F0]">
      <div className="flex items-center gap-[12px] cursor-pointer">
        <img src={ic_logo} alt="logo" />
        <h1 className="text-[20px] font-bold">EduNote</h1>
      </div>
      <div>
        <button className="flex items-center gap-[8px] text-[14px] text-[#4B5563]"><img src={ic_dashboard} alt="dashboard" /> 대시보드</button>
      </div>
    </nav>
  );
};

export default DefaultNavBar;
