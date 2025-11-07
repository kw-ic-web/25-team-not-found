import StudentSidebar from "../../components/sidebar/StudentSidebar";
import RoundedBlock from "../../components/RoundedBlock";
import ContinueStudyItem from "../../components/student/main/ContinueStudyItem";
import ic_plus from "../../assets/icons/ic_plus.svg";
import SearchBookItem from "../../components/student/main/SearchBookItem";
import QuizShortcutItem from "../../components/student/main/QuizShortcutItem";

const StudentMain = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const dayOfWeek = today.toLocaleString("ko-KR", { weekday: "long" });
  const formattedDate = `${year}년 ${month}월 ${day}일 ${dayOfWeek}`;

  return (
    <main className="flex w-full h-full bg-[#F6F7F8]">
      <StudentSidebar />
      <section className="py-[32px] px-[24px] w-full">
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
                  <button className="flex justify-center items-center gap-[13px] w-[86px] h-[40px] bg-[#13A4EC] rounded-[8px] text-[14px] text-white font-semibold cursor-pointer">
                    <img src={ic_plus} alt="+" className="size-[14px]" />
                    등록
                  </button>
                </span>
              }
            >
              <div className="flex gap-[20px] mt-[20px]">
                <SearchBookItem
                  title="생물학 기초"
                  subject="과학"
                  term="1학기"
                />
                <SearchBookItem
                  title="대수학 입문"
                  subject="수학"
                  term="1학기"
                />
              </div>
            </RoundedBlock>
          </section>
          <section>
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
          </section>
        </section>
      </section>
    </main>
  );
};

export default StudentMain;
