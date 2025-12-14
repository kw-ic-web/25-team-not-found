import { useEffect, useMemo, useState } from "react";
import ic_back from "../../assets/icons/student/ic_back.svg";
import ic_download_black from "../../assets/icons/student/dashboard/ic_download_black.svg";
import ic_calender from "../../assets/icons/student/dashboard/ic_calender.svg";
import ic_down_arrow from "../../assets/icons/student/dashboard/ic_down_arrow.svg";
import ic_subject_icon from "../../assets/icons/student/dashboard/ic_subject_icon.svg";
import ic_continuous_study from "../../assets/icons/student/dashboard/ic_continuous_study.svg";
import DiffRoundedBlock from "../../components/student/dashboard/DiffRoundedBlock";
import RoundedBlock from "../../components/RoundedBlock";
import DummyProgressBar from "../../components/DummyProgressBar";
import ProgressOfBookItem from "../../components/student/dashboard/ProgressOfBookItem";
import ColoredCalender from "../../components/student/dashboard/calender/ColoredCalender";
import CalenderBlock from "../../components/student/dashboard/calender/CalenderBlock";
import UpcomingClassItem from "../../components/student/dashboard/UpcomingClassItem";
import RecentQuizTable from "../../components/student/dashboard/RecentQuizTable";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setGeneralError("");
        const res = await api.get("/dashboard");
        setDashboard(res.data);
      } catch (err) {
        const status = err?.response?.status;
        if (status === 401) setGeneralError("로그인이 필요합니다. 다시 로그인해주세요.");
        else if (status >= 500)
          setGeneralError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        else
          setGeneralError(err?.response?.data?.message || "대시보드 조회에 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const summary = dashboard?.summary;

  const calendarList = useMemo(() => {
    const apiCalendar = dashboard?.calendar || [];
    const map = new Map(apiCalendar.map((x) => [x.date, x.level]));

    const weeks = 5;
    const cols = 7;
    const total = weeks * cols;
    const today = new Date();

    const toISODate = (d) => {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    };

    const list = [];
    for (let i = total - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = toISODate(d);

      const level = map.get(key) ?? 0;

      const type =
        level <= 0 ? 0 :
        level === 1 ? 1 :
        level === 2 ? 2 : 3;

      list.push(type);
    }
    return list;
  }, [dashboard]);

  // 최근 퀴즈는 API 응답에 없어서 기존 더미 유지(추후 백엔드 확장 시 교체)
  const recentQuizzes = [
    { title: "퀴즈 12", subject: "수학 교재", score: "92%", status: "통과" },
    { title: "퀴즈 11", subject: "과학 교재", score: "81%", status: "통과" },
    { title: "퀴즈 10", subject: "국어 교재", score: "73%", status: "보통" },
    { title: "퀴즈 9", subject: "수학 교재", score: "58%", status: "재도전" },
  ];

  return (
    <main className="flex flex-col items-center w-full min-h-screen bg-[#F6F7F8]">
      <header className="flex justify-center w-full h-[143px] bg-white border-b border-[#E2E8F0]">
        <div className="py-[12px] px-[24px] w-[1280px]">
          <div className="flex justify-between">
            <div className="flex gap-[12px] w-full">
              <button
                className="flex justify-center items-center gap-[4px] w-[96px] h-[40px] rounded-[8px] bg-[#13A4EC] text-[14px] text-white cursor-pointer"
                onClick={() => navigate(-1)}
              >
                <img src={ic_back} alt="" />
                뒤로가기
              </button>
              <h1 className="text-[24px] font-extrabold text-[#0F172A]">내 학습 대시보드</h1>
            </div>
            <button className="flex justify-center items-center gap-[8px] w-[102px] h-[42px] border border-[#E2E8F0] rounded-[8px] text-[14px] text-[#1F2937] cursor-pointer">
              <img src={ic_download_black} alt="" />
              내보내기
            </button>
          </div>

          <div className="flex gap-[8px] mt-[12px] mb-[8px]">
            <button className="flex justify-center items-center gap-[8px] w-[143px] h-[42px] border border-[#E2E8F0] rounded-[8px] text-[16px] cursor-pointer">
              <img src={ic_calender} alt="" />
              최근 30일
              <img src={ic_down_arrow} alt="" />
            </button>
            <img src={ic_subject_icon} alt="" />
            <button className="text-[16px] text-[#0F172A] cursor-pointer">전체</button>
            <button className="text-[16px] text-[#0F172A] cursor-pointer">수학</button>
            <button className="text-[16px] text-[#0F172A] cursor-pointer">과학</button>
            <button className="text-[16px] text-[#0F172A] cursor-pointer">국어</button>
          </div>

          <p className="text-[12px] text-[#64748B]">
            학습 시간, 진도, 퀴즈 성과를 한눈에 확인하세요.
          </p>
        </div>
      </header>
      <section className="flex flex-col gap-[32px] p-[24px] w-[1280px]">
        {generalError && (
          <p className="text-[12px] leading-4 text-[#DC2626]">{generalError}</p>
        )}
        {loading && (
          <p className="text-[12px] text-[#64748B]">불러오는 중...</p>
        )}
      
        <div className="flex gap-[16px]">
          <DiffRoundedBlock
            title="총 학습 시간"
            value={summary?.total_hours ?? "0"}
            diff="-2.5%"
          />
          <DiffRoundedBlock
            title="완료한 수업"
            value={summary?.completed_classes ?? "0"}
            diff="+7.6%"
          />
          <DiffRoundedBlock
            title="응시한 퀴즈"
            value={summary?.quizzes_taken ?? "0"}
            diff="+2.5%"
          />
          <DiffRoundedBlock
            title="평균 점수"
            value={summary?.average_score != null ? `${summary.average_score}%` : "0%"}
            diff="-1.2%"
          />

          <RoundedBlock className="flex flex-col gap-[4px] py-[15px] px-[17px] size-[140px]">
            <div className="flex justify-between items-center">
              <p className="text-[12px] font-semibold text-[#0F172A]">연속 학습</p>
              <img src={ic_continuous_study} alt="" />
            </div>
            <p className="text-[30px] font-extrabold text-[#0F172A]">
              {summary?.streak != null ? `${summary.streak}일` : "0일"}
            </p>
          </RoundedBlock>

          <RoundedBlock className="p-[17px] w-[296px] h-[140px]">
            <div className="flex justify-between mb-[8px]">
              <p className="text-[12px] font-semibold text-[#0F172A]">주간 학습시간 목표</p>
              <button className="text-[12px] text-[#13A4EC] cursor-pointer">수정</button>
            </div>
            <DummyProgressBar />
            <p className="mt-[8px] text-[12px] text-[#0F172A]">
              {summary?.weekly_goal
                ? `${summary.weekly_goal.current} / ${summary.weekly_goal.target} 시간`
                : "0 / 0 시간"}
            </p>
          </RoundedBlock>
        </div>

        <div className="flex justify-between">
          <RoundedBlock
            className="p-[21px] w-[608px] h-[282px]"
            title="주간 학습 추세"
            rightElement={
              <p className="text-[14px]">
                <span className="font-bold text-[#0F172A]">+8.3%</span> /{" "}
                <span className="text-[#64748B]">지난주 대비</span>
              </p>
            }
          ></RoundedBlock>
          <RoundedBlock
            className="flex flex-col gap-[4px] p-[21px] w-[608px] h-[282px]"
            title="퀴즈 점수 분포"
          >
            <p className="text-[12px] text-[#64748B]">최근 기간 응시 퀴즈(구간화)</p>
          </RoundedBlock>
        </div>

        <div className="flex justify-between">
          <RoundedBlock
            className="flex flex-col gap-[12px] p-[21px] w-[816px] h-[400px]"
            title="교재별 진도"
            rightElement={
              <button className="text-[14px] text-[#13A4EC] cursor-pointer">모두 펼치기</button>
            }
          >
            {(dashboard?.textbooks || []).map((tb) => (
              <ProgressOfBookItem key={tb.id} title={tb.title} progress={`${tb.progress}%`} />
            ))}
          </RoundedBlock>
          <RoundedBlock
            className="flex flex-col gap-[4px] p-[21px] w-[400px] h-[400px]"
            title="학습 캘린더"
          >
            <p className="text-[12px] text-[#64748B]">최근 7×5주 학습량</p>
            <ColoredCalender list={calendarList} />
            <div className="flex items-center gap-[8px] pt-[8px]">
              <CalenderBlock className="size-[16px]" type={1} />
              <p className="text-[11px] text-[#64748B]">낮음</p>
              <CalenderBlock className="size-[16px]" type={2} />
              <p className="text-[11px] text-[#64748B]">중간</p>
              <CalenderBlock className="size-[16px]" type={3} />
              <p className="text-[11px] text-[#64748B]">높음</p>
            </div>
          </RoundedBlock>
        </div>

        <div className="flex justify-between">
          <RoundedBlock
            className="flex flex-col gap-[12px] p-[21px] w-[608px] h-[276px]"
            title="다가오는 수업"
          >
            <UpcomingClassItem
              title="수학 실전 풀이"
              subtitle="수학 교재"
              runtime="45분"
              time="내일 19:00"
            />
            <div className="h-[1px] bg-[#E2E8F0]" />
            <UpcomingClassItem
              title="수학 실전 풀이"
              subtitle="수학 교재"
              runtime="45분"
              time="내일 19:00"
            />
            <div className="h-[1px] bg-[#E2E8F0]" />
            <UpcomingClassItem
              title="수학 실전 풀이"
              subtitle="수학 교재"
              runtime="45분"
              time="내일 19:00"
            />
          </RoundedBlock>
          <RoundedBlock
            className="flex flex-col gap-[12px] p-[21px] w-[608px] h-[276px]"
            title="최근 퀴즈"
            rightElement={
              <button className="text-[14px] text-[#13A4EC] cursor-pointer">퀴즈 보기</button>
            }
          >
            <RecentQuizTable quizzes={recentQuizzes} />
          </RoundedBlock>
        </div>
      </section>
    </main>
  );
};

export default StudentDashboard;