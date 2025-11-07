import ic_logo from "../../assets/icons/ic_logo.svg";
import { Home, Book, Classroom, Quiz, Dashboard } from "../icons";
import SidebarBtn from "./SidebarBtn";
import { useState } from "react";

const StudentSidebar = () => {
  const [activatedBtn, setActivatedBtn] = useState(0);

  return (
    <aside className="w-[287px] h-screen bg-white border-r border-[#E2E8F0]">
      <div className="flex items-center gap-[12px] pl-[20px] pt-[17.5px] pb-[18.5px] w-full border-b border-[#E2E8F0]">
        <img src={ic_logo} alt="logo" />
        <h1 className="text-[20px] font-bold tracking-[-0.45px]">EduNote</h1>
      </div>
      <div className="pt-[16px] px-[12px]">
        <SidebarBtn
          Icon={Home}
          isActivated={activatedBtn === 0}
          onClick={() => setActivatedBtn(0)}
        >
          학생 메인
        </SidebarBtn>
        <SidebarBtn
          Icon={Book}
          isActivated={activatedBtn === 1}
          onClick={() => setActivatedBtn(1)}
        >
          내 교재
        </SidebarBtn>
        <SidebarBtn
          Icon={Classroom}
          isActivated={activatedBtn === 2}
          onClick={() => setActivatedBtn(2)}
        >
          수업참여
        </SidebarBtn>
        <SidebarBtn
          Icon={Quiz}
          isActivated={activatedBtn === 3}
          onClick={() => setActivatedBtn(3)}
        >
          퀴즈풀이
        </SidebarBtn>
        <SidebarBtn
          Icon={Dashboard}
          isActivated={activatedBtn === 4}
          onClick={() => setActivatedBtn(4)}
        >
          학습 대시보드
        </SidebarBtn>
      </div>
    </aside>
  );
};

export default StudentSidebar;
