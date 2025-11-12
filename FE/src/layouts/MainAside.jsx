import { NavLink, Outlet } from "react-router-dom";
import ic_logo from "../assets/icons/ic_logo.svg";

const baseItem =
  "flex items-center gap-3 px-3 h-10 rounded-lg w-[255px]";
const activeItem = "bg-[rgba(19,164,236,0.10)]";
const labelBase = "text-[16px] leading-6";
const activeLabel = "text-[#13A4EC]";
const inactiveLabel = "text-slate-900";

function Dot({ className = "" }) {
  return (-
    <div className={`relative w-7 h-7`}>
      <div className="w-7 h-7" />
      <div className={`absolute inset-[8.33%] rounded ${className}`} />
    </div>
  );
}

export default function Aside() {
  return (
    <div className="relative flex flex-col items-start w-[288px] h-[1657px] bg-white">
      {/*   */}
      <div className="flex items-center gap-3 px-5 pb-[1px] w-[287px] h-16">
        <Dot className="bg-[#13A4EC]" />
        <div className="flex items-center h-7 w-[74px] font-extrabold text-[18px] leading-7 tracking-[-0.45px] text-slate-900">
          EduNote
        </div>
      </div>

      {/* 네비게이션 */}
      <nav className="flex flex-col p-4 gap-1 w-[287px] h-[1488px] overflow-auto">
        {/* 내 교재 */}
        <NavLink
          to="/teacher/book"
          className={({ isActive }) =>
            `${baseItem} ${isActive ? activeItem : ""}`
          }
        >
          <Dot className="bg-[#13A4EC]" />
          <span className={`${labelBase} ${activeLabel}`}>내 교재</span>
        </NavLink>

        {/* 퀴즈 관리 */}
        <NavLink
          to="/teacher/quiz"
          className={({ isActive }) =>
            `${baseItem} ${isActive ? activeItem : ""}`
          }
        >
          <Dot className="bg-slate-500/70" />
          <span className={`${labelBase} ${inactiveLabel}`}>퀴즈 관리</span>
        </NavLink>

        {/* 수업 시작 */}
        <NavLink
          to="/teacher/lecture"
          className={({ isActive }) =>
            `${baseItem} ${isActive ? activeItem : ""}`
          }
        >
          <Dot className="bg-slate-500/70" />
          <span className={`${labelBase} ${inactiveLabel}`}>수업 시작</span>
        </NavLink>

        {/* 학생 관리 */}
        <NavLink
          to="/teacher/student"
          className={({ isActive }) =>
            `${baseItem} ${isActive ? activeItem : ""}`
          }
        >
          <Dot className="bg-slate-500/70" />
          <span className={`${labelBase} ${inactiveLabel}`}>학생 관리</span>
        </NavLink>
      </nav>

      {/* 하단 구분선 영역 */}
      <div className="flex flex-col px-3 pt-[13px] pb-3 w-[287px] h-[105px] border-t border-slate-200">
        <NavLink to="/help" className="flex items-center gap-2 px-3 h-10 w-[263px] rounded-lg">
          <Dot className="bg-slate-900" />
          <span className="text-[16px] leading-6 text-slate-900">도움말</span>
        </NavLink>
        <NavLink to="/settings" className="flex items-center gap-2 px-3 h-10 w-[263px] rounded-lg">
          <Dot className="bg-slate-900" />
          <span className="text-[16px] leading-6 text-slate-900">설정</span>
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
}

