import StudentSidebar from "../../components/sidebar/StudentSidebar";
import RoundedBlock from "../../components/RoundedBlock";
import ContinueStudyItem from "../../components/student/main/ContinueStudyItem";

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
      <section className="w-full">
        <header className="flex flex-col gap-[8px] pl-[24px] py-[40px] w-full border-b border-[#E2E8F0]">
          <h1 className="text-[30px] text-[#0F172A] font-bold tracking-[-0.75px]">
            안녕하세요, <span className="text-[#13A4EC]">학생님</span>👋
          </h1>
          <p className="text-[16px] text-[#475569]">
            오늘은 {formattedDate}입니다. 좋은 학습 되세요!
          </p>
        </header>
        <section className="py-[32px] px-[24px]">
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
        </section>
      </section>
    </main>
  );
};

export default StudentMain;
