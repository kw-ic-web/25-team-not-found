import ic_logo from "../assets/icons/ic_logo.svg";

const DefaultNavBar = () => {
  return (
    <nav className="flex items-center w-full h-[65px] px-[40px] border-b-[1px] border-[#E2E8F0]">
      <div className="flex items-center gap-[12px] cursor-pointer">
        <img src={ic_logo} alt="logo" />
        <h1 className="text-[20px] font-bold">EduNote</h1>
      </div>
    </nav>
  );
};

export default DefaultNavBar;
