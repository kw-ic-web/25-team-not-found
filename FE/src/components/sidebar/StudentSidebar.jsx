import { useNavigate } from "react-router-dom";
import ic_logo from "../../assets/icons/ic_logo.svg";
import { Home, Book, Classroom, Quiz, Dashboard } from "../icons";
import SidebarBtn from "./SidebarBtn";
import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import api from "../../api/api";
import SearchBookItem from "../student/main/SearchBookItem";

const StudentSidebar = () => {
  const [activatedBtn, setActivatedBtn] = useState(0);

  const navigate = useNavigate();

  const [enterClassOpen, setEnterClassOpen] = useState(false);
  const [enrolledTextbooks, setEnrolledTextbooks] = useState(null);

  useEffect(() => {
    if (enterClassOpen) {
      (async () => {
        const { data } = await api.get("/textbooks/enrolled");
        setEnrolledTextbooks(data);
      })();
    }
  }, [enterClassOpen]);

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
          onClick={() => {
            setActivatedBtn(0);
            navigate("/student");
          }}
        >
          학생 메인
        </SidebarBtn>
        {/* <SidebarBtn Icon={Book} isActivated={activatedBtn === 1} onClick={() => {
          setActivatedBtn(1);
          navigate("/student/book");
        }}>
          내 교재
        </SidebarBtn> */}
        <SidebarBtn
          Icon={Classroom}
          isActivated={activatedBtn === 2}
          onClick={() => {
            if (enrolledTextbooks && enrolledTextbooks.length > 0) {
              setActivatedBtn(2);
              setEnterClassOpen(true);
            } else {
              alert("수강하고 있는 교재가 없습니다.");
            }
            // navigate("/lecture?role=student");
          }}
        >
          수업참여
        </SidebarBtn>
        <Dialog open={enterClassOpen} onClose={() => setEnterClassOpen(false)}>
          {enrolledTextbooks &&
            enrolledTextbooks.map((enrolledTextbook) => (
              <div
                key={enrolledTextbook.textbook_id}
                className="cursor-pointer"
                onClick={() => {
                  navigate("/lecture?role=student", {
                    state: {
                      textbookId: enrolledTextbook.textbook_id,
                      title: enrolledTextbook.title,
                    },
                  });
                }}
              >
                <SearchBookItem
                  title={enrolledTextbook.title}
                  subject={enrolledTextbook.subject || ""}
                  term={enrolledTextbook.term || ""}
                />
              </div>
            ))}
        </Dialog>
        <SidebarBtn
          Icon={Quiz}
          isActivated={activatedBtn === 3}
          onClick={() => {
            setActivatedBtn(3);
            navigate("/student/quiz");
          }}
        >
          퀴즈풀이
        </SidebarBtn>
        <SidebarBtn
          Icon={Dashboard}
          isActivated={activatedBtn === 4}
          onClick={() => {
            setActivatedBtn(4);
            navigate("/student/dashboard");
          }}
        >
          학습 대시보드
        </SidebarBtn>
      </div>
    </aside>
  );
};

export default StudentSidebar;
