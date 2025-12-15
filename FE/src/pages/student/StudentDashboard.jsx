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
import QuizScoreDistribution from "../../components/student/dashboard/QuizScoreDistribution";
import WeeklyStudyTrend from "../../components/student/dashboard/WeeklyStudyTrend";
import WeeklyGoalEditModal from "../../components/student/dashboard/WeeklyGoalEditModal";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import Modal from "@mui/material/Modal";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [openAllTextbooksModal, setOpenAllTextbooksModal] = useState(false);
  const [openGoalModal, setOpenGoalModal] = useState(false);
  const [weeklyGoalTarget, setWeeklyGoalTarget] = useState(null);

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
        else setGeneralError(err?.response?.data?.message || "대시보드 조회에 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const summary = dashboard?.summary;

  useEffect(() => {
    const t = summary?.weekly_goal?.target;
    if (t == null) return;
    setWeeklyGoalTarget(t);
  }, [summary?.weekly_goal?.target]);

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
      const type = level <= 0 ? 0 : level === 1 ? 1 : level === 2 ? 2 : 3;
      list.push(type);
    }
    return list;
  }, [dashboard]);

  const textbooks = dashboard?.textbooks || [];
  const previewTextbooks = textbooks.slice(0, 2);
  const extraCount = Math.max(0, textbooks.length - previewTextbooks.length);

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

          <p className="text-[12px] text-[#64748B]">학습 시간, 진도, 퀴즈 성과를 한눈에 확인하세요.</p>
        </div>
      </header>

      <section className="flex flex-col gap-[32px] p-[24px] pb-[56px] w-[1280px]">
        {generalError && <p className="text-[12px] leading-4 text-[#DC2626]">{generalError}</p>}
        {loading && <p className="text-[12px] text-[#64748B]">불러오는 중...</p>}

        <div className="flex gap-[16px]">
          <DiffRoundedBlock title="총 학습 시간" value={summary?.total_hours ?? "0"} diff="-2.5%" />
          <DiffRoundedBlock title="완료한 수업" value={summary?.completed_classes ?? "0"} diff="+7.6%" />
          <DiffRoundedBlock title="응시한 퀴즈" value={summary?.quizzes_taken ?? "0"} diff="+2.5%" />
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
              <button
                className="text-[12px] text-[#13A4EC] cursor-pointer"
                onClick={() => setOpenGoalModal(true)}
              >
                수정
              </button>
            </div>
            <DummyProgressBar />
            <p className="mt-[8px] text-[12px] text-[#0F172A]">
              {summary?.weekly_goal
                ? `${summary.weekly_goal.current} / ${weeklyGoalTarget ?? summary.weekly_goal.target} 시간`
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
          >
            <div className="mt-[8px] h-[200px]">
              <WeeklyStudyTrend apiWeeklyActivity={dashboard?.charts?.weekly_activity} />
            </div>
          </RoundedBlock>
          <RoundedBlock
            className="flex flex-col gap-[4px] p-[21px] w-[608px] h-[282px]"
            title="퀴즈 점수 분포"
          >
            <p className="text-[12px] text-[#64748B]">최근 기간 응시 퀴즈(구간화)</p>
            <QuizScoreDistribution apiQuizScores={dashboard?.charts?.quiz_scores} />
          </RoundedBlock>
        </div>
        <div className="flex justify-between">
          <RoundedBlock
            className="flex flex-col gap-[12px] p-[21px] pb-[20px] w-[816px] h-[300px]"
            title="교재별 진도"
            rightElement={
              textbooks.length > 0 ? (
                <button
                  className="text-[14px] text-[#13A4EC] cursor-pointer"
                  onClick={() => setOpenAllTextbooksModal(true)}
                >
                  모두 펼치기
                </button>
              ) : (
                <span />
              )
            }
          >
            <div className="flex flex-col gap-[12px] flex-1 min-h-0">
              {previewTextbooks.map((tb) => (
                <div key={tb.id} className="w-full">
                  <ProgressOfBookItem title={tb.title} progress={`${tb.progress}%`} />
                </div>
              ))}

              {!loading && !generalError && textbooks.length === 0 && (
                <p className="text-[12px] text-[#64748B]">수강 중인 교재가 없습니다.</p>
              )}

              {extraCount > 0 && (
                <div className="mt-auto">
                  <span className="inline-flex items-center px-[10px] py-[6px] rounded-full bg-[#F1F5F9] text-[12px] text-[#475569]">
                    외 {extraCount}개의 교재가 더 있습니다.
                  </span>
                </div>
              )}
            </div>
          </RoundedBlock>

          <RoundedBlock className="flex flex-col gap-[4px] p-[21px] w-[400px] h-[300px]" title="학습 캘린더">
            <p className="text-[12px] text-[#64748B]">최근 7×5주 학습량</p>
            <div className="flex-1 flex items-center">
              <ColoredCalender list={calendarList} />
            </div>
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
      </section>
      <Modal
        open={openAllTextbooksModal}
        onClose={() => setOpenAllTextbooksModal(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <div className="flex flex-col w-[1200px] max-h-[800px] bg-white rounded-[16px] overflow-hidden">
          <div className="flex justify-between items-center p-[24px] border-b border-[#E2E8F0]">
            <h2 className="text-[24px] font-bold text-[#0F172A]">교재 선택</h2>
            <button
              onClick={() => setOpenAllTextbooksModal(false)}
              className="text-[20px] text-[#64748B] hover:text-[#0F172A]"
            >
              ×
            </button>
          </div>
          <div className="grid grid-cols-3 gap-[20px] p-[24px] overflow-y-auto">
            {textbooks.map((tb) => (
              <div
                key={tb.id}
                className="cursor-pointer rounded-[16px] border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all"
                onClick={() => setOpenAllTextbooksModal(false)}
              >
                <div className="p-[16px]">
                  <ProgressOfBookItem title={tb.title} progress={`${tb.progress}%`} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-[12px] p-[24px] border-t border-[#E2E8F0]">
            <button
              onClick={() => setOpenAllTextbooksModal(false)}
              className="px-[24px] py-[12px] rounded-[8px] border border-[#CBD5E1] text-[14px] font-semibold text-[#475569] hover:bg-[#F1F5F9]"
            >
              닫기
            </button>
          </div>
        </div>
      </Modal>
      <WeeklyGoalEditModal
        open={openGoalModal}
        onClose={() => setOpenGoalModal(false)}
        api={api}
        currentTarget={weeklyGoalTarget ?? summary?.weekly_goal?.target ?? 0}
        onSaved={(newTarget) => {
          setWeeklyGoalTarget(newTarget);
          setDashboard((prev) => {
            if (!prev) return prev;
            const cur = prev?.summary?.weekly_goal?.current ?? "0";
            return {
              ...prev,
              summary: {
                ...prev.summary,
                weekly_goal: { current: cur, target: newTarget },
              },
            };
          });
        }}
      />
    </main>
  );
};

export default StudentDashboard;