import StudentSidebar from "../../components/sidebar/StudentSidebar";
import RoundedBlock from "../../components/RoundedBlock";
import ContinueStudyItem from "../../components/student/main/ContinueStudyItem";
import ic_plus from "../../assets/icons/student/main/ic_plus.svg";
import SearchBookItem from "../../components/student/main/SearchBookItem";
import QuizShortcutItem from "../../components/student/main/QuizShortcutItem";
import { ic_bell, ic_check, ic_feedback } from "../../assets/icons/student/main/recent_notice";
import MyProgressSummaryItem from "../../components/student/main/MyProgressSummaryItem";
import { useEffect, useState } from "react";
import api from "../../api/api";
import Modal from "@mui/material/Modal";
import { twJoin } from "tailwind-merge";

const StudentMain = () => {
  const [data, setData] = useState(null);

  const [openTextbookEnrollModal, setOpenTextbookEnrollModal] = useState(false);
  const [allTextbooks, setAllTextbooks] = useState(null);
  const [selectedToEnrollTextbook, setSelectedToEnrollTextbook] = useState(null);

  const [enrolledTextbooks, setEnrolledTextbooks] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await api.get("/dashboard");
      setData(data);
      console.log(data);
    })();

    (async () => {
      const { data } = await api.get("/textbooks");
      setAllTextbooks(data);
    })();

    (async () => {
      const { data } = await api.get("/textbooks/enrolled");
      setEnrolledTextbooks(data);
    })();
  }, []);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const dayOfWeek = today.toLocaleString("ko-KR", { weekday: "long" });
  const formattedDate = `${year}년 ${month}월 ${day}일 ${dayOfWeek}`;

  return (
    <main className="flex w-full h-full bg-[#F6F7F8]">
      <StudentSidebar />
      <section className="py-[32px] px-[24px]">
        <header className="flex flex-col gap-[8px] pl-[24px] py-[40px] w-full border-b border-[#E2E8F0]">
          <h1 className="text-[30px] text-[#0F172A] font-bold tracking-[-0.75px]">
            안녕하세요, <span className="text-[#13A4EC]">학생님</span>👋
          </h1>
          <p className="text-[16px] text-[#475569]">
            오늘은 {formattedDate}입니다. 좋은 학습 되세요!
          </p>
        </header>
        <section className="flex flex-col gap-[40px]">
          <section className="flex gap-[24px]">
            <RoundedBlock
              title="이어 학습"
              rightElement={
                <button className="text-[14px] text-[#13A4EC] font-semibold cursor-pointer">
                  전체 보기
                </button>
              }
            >
              <div className="mt-[16px] w-full">
                <ContinueStudyItem>생물학 기초</ContinueStudyItem>
                <ContinueStudyItem>대수학 입문</ContinueStudyItem>
              </div>
            </RoundedBlock>
            <RoundedBlock
              className="flex-1 min-w-[512px]"
              title="내 교재"
              rightElement={
                <span className="flex gap-[8px]">
                  <input
                    type="text"
                    placeholder="교재 검색"
                    className="py-[11px] px-[13px] w-[255.5px] h-[41px] rounded-[8px] border border-[#CBD5E1] text-[16px]"
                  />
                  <button
                    className="flex justify-center items-center gap-[13px] w-[86px] h-[40px] bg-[#13A4EC] rounded-[8px] text-[14px] text-white font-semibold cursor-pointer"
                    onClick={() => setOpenTextbookEnrollModal(true)}
                  >
                    <img src={ic_plus} alt="+" className="size-[14px]" />
                    등록
                  </button>
                </span>
              }
            >
              <div className="grid grid-cols-3 gap-[20px] mt-[20px] overflow-y-auto max-h-[242px]">
                {enrolledTextbooks &&
                  enrolledTextbooks.map((enrolledTextbook) => (
                    <SearchBookItem
                      key={enrolledTextbook.textbook_id}
                      title={enrolledTextbook.title}
                      subject={enrolledTextbook.subject || ""}
                      term={enrolledTextbook.term || ""}
                      onClick={() => setSelectedToEnrollTextbook(enrolledTextbook.textbook_id)}
                    />
                  ))}
              </div>
            </RoundedBlock>

            <Modal
              open={openTextbookEnrollModal}
              onClose={() => {
                setOpenTextbookEnrollModal(false);
                setSelectedToEnrollTextbook(null);
              }}
              sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            >
              <div className="flex flex-col w-[1200px] max-h-[800px] bg-white rounded-[16px]">
                <div className="flex justify-between items-center p-[24px] border-b border-[#E2E8F0]">
                  <h2 className="text-[24px] font-bold text-[#0F172A]">교재 선택</h2>
                  <button
                    onClick={() => {
                      setOpenTextbookEnrollModal(false);
                      setSelectedToEnrollTextbook(null);
                    }}
                    className="text-[20px] text-[#64748B] hover:text-[#0F172A]"
                  >
                    ×
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-[20px] p-[24px] overflow-y-auto">
                  {allTextbooks &&
                    allTextbooks.map((textbook) => (
                      <div
                        key={textbook.textbook_id}
                        onClick={() => setSelectedToEnrollTextbook(textbook.textbook_id)}
                        className={twJoin(
                          "cursor-pointer rounded-[16px] border-2 transition-all relative",
                          selectedToEnrollTextbook === textbook.textbook_id
                            ? "border-[#13A4EC] bg-[#F0F9FF]"
                            : "border-[#E2E8F0] hover:border-[#CBD5E1]"
                        )}
                      >
                        {selectedToEnrollTextbook === textbook.textbook_id && (
                          <div className="absolute top-[12px] right-[12px] w-[24px] h-[24px] bg-[#13A4EC] rounded-full flex items-center justify-center">
                            <img src={ic_check} alt="선택됨" className="w-[16px] h-[16px]" />
                          </div>
                        )}
                        <SearchBookItem
                          title={textbook.title}
                          subject={textbook.subject}
                          term={textbook.term}
                        />
                      </div>
                    ))}
                </div>
                <div className="flex justify-end gap-[12px] p-[24px] border-t border-[#E2E8F0]">
                  <button
                    onClick={() => {
                      setOpenTextbookEnrollModal(false);
                      setSelectedToEnrollTextbook(null);
                    }}
                    className="px-[24px] py-[12px] rounded-[8px] border border-[#CBD5E1] text-[14px] font-semibold text-[#475569] hover:bg-[#F1F5F9]"
                  >
                    취소
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        if (selectedToEnrollTextbook) {
                          const { data } = await api.post("/enrollments", {
                            textbook_id: selectedToEnrollTextbook,
                            role: "student",
                          });
                          console.log(data);
                          alert("교재 등록 완료");
                          setOpenTextbookEnrollModal(false);
                          setSelectedToEnrollTextbook(null);
                        }
                      } catch (error) {
                        console.error(error);
                      }
                    }}
                    disabled={!selectedToEnrollTextbook}
                    className={twJoin(
                      "px-[24px] py-[12px] rounded-[8px] text-[14px] font-semibold text-white",
                      selectedToEnrollTextbook
                        ? "bg-[#13A4EC] hover:bg-[#0D8BC7] cursor-pointer"
                        : "bg-[#CBD5E1] cursor-not-allowed"
                    )}
                  >
                    확인
                  </button>
                </div>
              </div>
            </Modal>
          </section>
          <section className="flex gap-[24px]">
            <RoundedBlock
              className="w-[1048px] h-[190px]"
              title="퀴즈 바로가기"
              rightElement={
                <button className="text-[14px] text-[#13A4EC] font-semibold cursor-pointer">
                  모두 보기
                </button>
              }
            >
              <div className="flex gap-[16px] mt-[16px]">
                <QuizShortcutItem
                  title="생물학 기초"
                  quizAmount="2"
                  questionsAmount="10"
                  limit="15분"
                />
                <QuizShortcutItem
                  title="생물학 기초"
                  quizAmount="2"
                  questionsAmount="10"
                  limit="15분"
                />
                <QuizShortcutItem
                  title="생물학 기초"
                  quizAmount="2"
                  questionsAmount="10"
                  limit="15분"
                />
              </div>
            </RoundedBlock>
            <RoundedBlock
              className="flex-1 h-[190px]"
              title="최근 알림"
              rightElement={
                <button className="w-[80px] h-[28px] bg-[#F1F5F9] rounded-[8px] text-[14px] text-[#475569]">
                  모두 확인
                </button>
              }
            >
              <div className="flex flex-col justify-between mt-[16px]">
                <div className="flex items-center gap-[12px]">
                  <img src={ic_bell} alt="" />
                  <p className="text-[14px] text-[#0F172A]">
                    <span className="font-bold">생물학 기초</span> 과제 마감이 2일 남았어요.
                  </p>
                </div>
                <div className="flex items-center gap-[12px]">
                  <img src={ic_feedback} alt="" />
                  <p className="text-[14px] text-[#0F172A]">
                    <span className="font-bold">대수학 입문</span> 3주차 수업 완료! 훌륭해요 👏
                  </p>
                </div>
                <div className="flex items-center gap-[12px]">
                  <img src={ic_check} alt="" />
                  <p className="text-[14px] text-[#0F172A]">
                    교사로부터 <span className="font-bold">피드백</span>이 도착했어요.
                  </p>
                </div>
              </div>
            </RoundedBlock>
          </section>
          <section className="flex gap-[24px]">
            <RoundedBlock
              className="flex-1 min-w-[512px] h-[238.5px]"
              title="나의 진행률 요약"
              rightElement={
                <button className="text-[14px] text-[#13A4EC] font-semibold cursor-pointer">
                  학습 대시보드 →
                </button>
              }
            >
              <div className="flex flex-col gap-[20px] mt-[24px]">
                <div className="flex gap-[16px]">
                  <MyProgressSummaryItem title="완료한 수업" amount="12 / 20" />
                  <MyProgressSummaryItem title="퀴즈 평균점" amount="82점" />
                </div>
                <div className="flex gap-[16px]">
                  <MyProgressSummaryItem title="이번 주 학습 시간" amount="4.5h / 6h" />
                  <MyProgressSummaryItem title="과제 제출" amount="3 / 5" />
                </div>
              </div>
            </RoundedBlock>
            <RoundedBlock
              className="w-[512px] h-[238.5px]"
              title="주간 학습 활동"
              rightElement={
                <button className="w-[80px] h-[28px] bg-[#F1F5F9] rounded-[8px] text-[14px] text-[#475569]">
                  최근 7일
                </button>
              }
            />
          </section>
        </section>
      </section>
    </main>
  );
};

export default StudentMain;
