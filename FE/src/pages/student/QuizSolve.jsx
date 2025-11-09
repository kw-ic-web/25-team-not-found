import RoundedBlock from "../../components/RoundedBlock";
import CourseItem from "../../components/student/quiz/CourseItem";
import { useState } from "react";
import QuizItem from "../../components/student/quiz/QuizItem";
import ic_window_open from "../../assets/icons/student/main/quiz/ic_window_open.svg";
import SelectItem from "../../components/student/quiz/SelectItem";

const QuizSolve = () => {
  const [selectedCourse, setSelectedCourse] = useState(0);
  const [selectedQuiz, setSelectedQuiz] = useState(0);
  const [step, setStep] = useState(1);
  const STEP_LIMIT = 5;
  return (
    <main className="flex justify-center gap-[32px] pt-[32px] w-full min-h-screen bg-[#F6F7F8]">
      <RoundedBlock className="w-[348px] h-[602px]" title="내 강좌">
        <section className="flex flex-col justify-between pt-[16px] h-full">
          <div className="flex flex-col gap-[8px]">
            <CourseItem
              title="대수학 입문"
              subject="수학"
              isSelected={selectedCourse === 0}
              onClick={() => setSelectedCourse(0)}
            />
            <CourseItem
              title="생물학 기초"
              subject="과학"
              isSelected={selectedCourse === 1}
              onClick={() => setSelectedCourse(1)}
            />
            <CourseItem
              title="대수학 입문"
              subject="수학"
              isSelected={selectedCourse === 2}
              onClick={() => setSelectedCourse(2)}
            />
          </div>
          <div className="mb-[25px]">
            <p className="text-[18px] font-bold">생물학 기초 퀴즈</p>

            <div className="flex flex-col gap-[8px] mt-[16px]">
              <QuizItem
                title="세포 구조"
                isSelected={selectedQuiz === 0}
                onClick={() => setSelectedQuiz(0)}
              />
              <QuizItem
                title="함수의 개념"
                isSelected={selectedQuiz === 1}
                onClick={() => setSelectedQuiz(1)}
              />
              <QuizItem
                title="유전"
                isSelected={selectedQuiz === 2}
                onClick={() => setSelectedQuiz(2)}
              />
            </div>
          </div>
        </section>
      </RoundedBlock>
      <RoundedBlock className="flex flex-col gap-[16px] w-[728px] h-[657px]">
        <div className="flex flex-col gap-[4px] mt-[-16px]">
          <h1 className="text-[24px] font-bold">퀴즈 2: 함수의 개념</h1>
          <p className="text-[14px] text-[#526D7A]">
            문항 {step} / {STEP_LIMIT}
          </p>
        </div>
        <div className="h-[4px] rounded-[9999px] bg-[#F6F7F8]"></div>

        <h2 className="text-[18px] font-semibold text-[#0D1F29]">
          다음 중 선형함수는 무엇인가요?
        </h2>
        <section className="flex flex-col gap-[16px] py-[8px]">
          <SelectItem>f(x) = 2x + 3</SelectItem>
          <SelectItem>f(x) = 2x + 3</SelectItem>
          <SelectItem>f(x) = 2x + 3</SelectItem>
          <SelectItem>f(x) = 2x + 3</SelectItem>
        </section>

        <div className="flex justify-end w-full mt-[16px] mb-[8px]">
          <button className="w-[112px] h-[40px] bg-[#13A4EC] rounded-[12px] text-[16px] text-white font-bold cursor-pointer">
            정답 제출
          </button>
        </div>

        <div className="h-[1px] border border-[#E2E8F0]" />

        <div className="flex justify-center items-center gap-[70px] w-full">
          <button
            className="w-[143px] h-[40px] rounded-[12px] bg-[#13A4EC] text-[24px] text-white cursor-pointer"
            onClick={() => {
              if (step === 1) {
                return;
              }
              setStep(step - 1);
            }}
          >
            이전페이지
          </button>
          <p>
            {step} / {STEP_LIMIT}
          </p>
          <button
            className="w-[143px] h-[40px] rounded-[12px] bg-[#13A4EC] text-[24px] text-white cursor-pointer"
            onClick={() => {
              if (step === STEP_LIMIT) {
                return;
              }
              setStep(step + 1);
            }}
          >
            다음페이지
          </button>
        </div>
      </RoundedBlock>
      <RoundedBlock
        className="flex flex-col gap-[16px] w-[348px] h-[248px]"
        title="출제 근거 (교재)"
        rightElement={
          <button className="w-[36px] h-[20px] bg-[#13A4EC]/10 text-[12px] font-semibold text-[#13A4EC] rounded-[9999px]">
            p. -
          </button>
        }
      >
        <p className="text-[14px] text-[#64748B]">
          선택된 텍스트가 없습니다. (교재에서 선택 후 출제되지 않았습니다)
        </p>
        <button className="flex justify-center items-center gap-[8px] w-full h-[42px] border border-[#E2E8F0] rounded-[12px]">
          <img src={ic_window_open} alt="" />
          교재 열기
        </button>
        <p className="text-[12px] text-[#64748B]">
          ※ 어떤 페이지·문단에서 문제가 출제되었는지 확인하세요.
        </p>
      </RoundedBlock>
    </main>
  );
};

export default QuizSolve;
