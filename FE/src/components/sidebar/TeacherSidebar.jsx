import ic_logo from "../../assets/icons/ic_logo.svg";
import { Home, Book, Classroom, Quiz, Dashboard } from "../icons";
import SidebarBtn from "./SidebarBtn";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TeacherSidebar = () => {
  const [activatedBtn, setActivatedBtn] = useState(0);
  const navigate = useNavigate();
  const handleClickStartButton = () => {
    setActivatedBtn(3);
    setIsClassStartOpen(true); // 강의 시작
  };
  const handleStartClass = () => {
    setIsClassStartOpen(false);  
    navigate("/teacher/lecture"); 
  };
  return (
    <aside className="w-[287px] shrink-0 bg-white border-r border-[#E2E8F0]">
      {/* 상단 로고 */}
      <div className="sticky top-0 z-10 bg-white">
        <div className="flex items-center gap-[12px] pl-[20px] pt-[17.5px] pb-[18.5px] w-full border-b border-[#E2E8F0]">
          <img src={ic_logo} alt="logo" />
          <h1 className="text-[20px] font-bold tracking-[-0.45px]">EduNote</h1>
        </div>
      </div>

            {/* 메뉴 리스트 */}
            <div className="sticky top-16 h-[calc(100vh-64px)] overflow-y-auto pt-[16px] px-[12px]">
        <SidebarBtn
          Icon={Home}
          isActivated={activatedBtn === 0}
          onClick={() => {
            setActivatedBtn(0);
            navigate("/teacher");        // 교사 대시보드
          }}
        >
          교사 대시보드
        </SidebarBtn>

        <SidebarBtn
          Icon={Book}
          isActivated={activatedBtn === 1}
          onClick={() => {
            setActivatedBtn(1);
            navigate("/teacher/book");   // 교재 제작
          }}
        >
          교재 제작
        </SidebarBtn>

        <SidebarBtn
          Icon={Quiz}
          isActivated={activatedBtn === 2}
          onClick={() => {
            setActivatedBtn(2);
            navigate("/teacher/quiz");   // 퀴즈 제작
          }}
        >
          퀴즈 제작
        </SidebarBtn>

        <SidebarBtn
  Icon={Classroom}
  isActivated={activatedBtn === 3}
  onClick={() => {
    setActivatedBtn(3);
    setIsStartClassOpen(true); // 모달만 열기
  }}
>
  강의 시작
</SidebarBtn>


        <SidebarBtn
          Icon={Dashboard}
          isActivated={activatedBtn === 4}
          onClick={() => {
            setActivatedBtn(4);
            navigate("/teacher/student"); // 학생 관리
          }}
        >
          학생 관리
        </SidebarBtn>
      </div>
    </aside>
  );
};


export default TeacherSidebar;
