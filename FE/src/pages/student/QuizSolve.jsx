import RoundedBlock from "../../components/RoundedBlock";
import CourseItem from "../../components/student/quiz/CourseItem";
import { useState } from "react";
import QuizItem from "../../components/student/quiz/QuizItem";

const QuizSolve = () => {
  const [selectedCourse, setSelectedCourse] = useState(0);
  const [selectedQuiz, setSelectedQuiz] = useState(0);
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
      <RoundedBlock title="내 강좌"></RoundedBlock>
      <RoundedBlock title="내 강좌"></RoundedBlock>
    </main>
  );
};

export default QuizSolve;
