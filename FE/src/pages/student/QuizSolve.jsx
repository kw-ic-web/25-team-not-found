import RoundedBlock from "../../components/RoundedBlock";
import CourseItem from "../../components/student/quiz/CourseItem";
import { useEffect, useState } from "react";
import QuizItem from "../../components/student/quiz/QuizItem";
import ic_window_open from "../../assets/icons/student/main/quiz/ic_window_open.svg";
import SelectItem from "../../components/student/quiz/SelectItem";
import api from "../../api/api";
import { useLocation } from "react-router-dom";

const QuizSolve = () => {
  const [textbooks, setTextbooks] = useState(null);

  const location = useLocation();
  const { textbookId } = location.state || {};

  useEffect(() => {
    try {
      const fetchData = async () => {
        const { data } = await api.get("/textbooks/enrolled");
        setTextbooks(data);
        const selectedCourse = data.find((textbook) => textbook.textbook_id === textbookId);
        if (selectedCourse) {
          setSelectedCourse(selectedCourse);
        } else if (data) {
          setSelectedCourse(data[0]);
        }
      };
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, [textbookId]);

  const [selectedCourse, setSelectedCourse] = useState(null);

  // selectedCourse의 page_id 가져오고, 기반으로 퀴즈 가져오기, for문 순회
  useEffect(() => {
    if (!selectedCourse) return;

    setGroupedQuizzes({}); // 초기화
    setSelectedQuizId(null); // 선택된 퀴즈 초기화
    setStep(1); // step 초기화

    (async () => {
      try {
        const { data } = await api.get(
          `/textbooks/${selectedCourse.textbook_id}/versions/${selectedCourse.latest_version}/pages`
        );
        const allQuizzes = [];
        for (const page of data) {
          try {
            const { data: quizData } = await api.get(`/quiz-managements/${page.page_id}`);
            if (quizData && Array.isArray(quizData)) {
              allQuizzes.push(...quizData);
            }
          } catch (error) {
            console.log(`페이지 ${page.page_id}의 퀴즈를 가져오는 중 오류:`, error);
          }
        }
        // 중복된 question_id를 가진 퀴즈 제거
        const uniqueQuizzes = allQuizzes.filter(
          (quiz, index, self) => index === self.findIndex((q) => q.question_id === quiz.question_id)
        );

        // quiz_id로 그룹화
        const grouped = {};
        uniqueQuizzes.forEach((quiz) => {
          if (!grouped[quiz.quiz_id]) {
            grouped[quiz.quiz_id] = {
              quiz_id: quiz.quiz_id,
              title: quiz.title,
              created_at: quiz.created_at,
              questions: [],
            };
          }
          // question_order로 정렬하여 추가
          grouped[quiz.quiz_id].questions.push({
            question_id: quiz.question_id,
            question_type: quiz.question_type,
            question_content: quiz.question_content,
            options: quiz.options,
            correct_answer: quiz.correct_answer,
            explanation: quiz.explanation,
            question_order: quiz.question_order,
          });
        });

        // 각 퀴즈의 문제들을 question_order로 정렬
        Object.keys(grouped).forEach((quizId) => {
          grouped[quizId].questions.sort((a, b) => a.question_order - b.question_order);
        });

        setGroupedQuizzes(grouped);

        // 첫 번째 퀴즈를 자동 선택
        const firstQuizId = Object.keys(grouped)[0];
        if (firstQuizId) {
          setSelectedQuizId(firstQuizId);
        }
      } catch (error) {
        console.log("퀴즈 목록을 가져오는 중 오류:", error);
      }
    })();
  }, [selectedCourse]);

  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [step, setStep] = useState(1);
  const [groupedQuizzes, setGroupedQuizzes] = useState({}); // quiz_id를 key로 하는 객체
  const [selectQuizAnswer, setSelectQuizAnswer] = useState("");

  // 퀴즈 선택 시 step 초기화
  useEffect(() => {
    if (selectedQuizId) {
      setStep(1);
      setSelectQuizAnswer("");
    }
  }, [selectedQuizId]);

  // 이 useEffect는 사용하지 않음 (selectedCourse 기반으로 퀴즈를 가져오므로)
  // useEffect(() => {
  //   try {
  //     const fetchData = async () => {
  //       const { data } = await api.get(`/quizzes/${quizId}/questions`);
  //       setQuizList(data.data);
  //     };
  //     fetchData();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, [quizId]);

  const onClickQuizSubmit = async () => {
    if (!selectedQuizId || !groupedQuizzes[selectedQuizId]) return;

    const currentQuestion = groupedQuizzes[selectedQuizId].questions[step - 1];
    if (!currentQuestion || !selectQuizAnswer) {
      alert("답을 선택해주세요");
      return;
    }

    try {
      const { data } = await api.post(`/quizzes/${selectedQuizId}/submit`, {
        answers: [
          {
            question_id: currentQuestion.question_id,
            student_answer: selectQuizAnswer,
          },
        ],
      });

      if (data.data.results.is_correct) {
        alert("정답입니다");
      } else {
        alert("틀렸습니다");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="flex justify-center gap-[32px] pt-[32px] w-full min-h-screen bg-[#F6F7F8]">
      <RoundedBlock className="w-[348px] h-[602px]" title="내 강좌">
        <section className="flex flex-col justify-between pt-[16px] h-full">
          <div className="flex flex-col gap-[8px] overflow-y-auto max-h-[242px]">
            {textbooks &&
              textbooks.map((textbook) => (
                <CourseItem
                  key={textbook.textbook_id}
                  title={textbook.title}
                  subject={textbook.subject || ""}
                  isSelected={selectedCourse === textbook}
                  onClick={() => setSelectedCourse(textbook)}
                />
              ))}
          </div>
          <div className="mb-[25px]">
            <p className="text-[18px] font-bold">
              {textbooks &&
                textbooks.find((textbook) => textbook.textbook_id === selectedCourse?.textbook_id)
                  ?.title}{" "}
              퀴즈
            </p>

            <div className="flex flex-col gap-[8px] mt-[16px]">
              {Object.values(groupedQuizzes).map((quiz) => (
                <QuizItem
                  key={quiz.quiz_id}
                  title={quiz.title}
                  isSelected={selectedQuizId === quiz.quiz_id}
                  onClick={() => setSelectedQuizId(quiz.quiz_id)}
                />
              ))}
            </div>
          </div>
        </section>
      </RoundedBlock>
      <RoundedBlock className="flex flex-col gap-[16px] w-[728px] h-[657px]">
        {selectedQuizId && groupedQuizzes[selectedQuizId] && (
          <>
            <div className="flex flex-col gap-[4px] mt-[-16px]">
              <h1 className="text-[24px] font-bold">
                퀴즈: {groupedQuizzes[selectedQuizId].title}
              </h1>
              <p className="text-[14px] text-[#526D7A]">
                문항 {step} / {groupedQuizzes[selectedQuizId].questions.length}
              </p>
            </div>
            <div className="h-[4px] rounded-[9999px] bg-[#F6F7F8]"></div>

            {groupedQuizzes[selectedQuizId].questions[step - 1] && (
              <>
                <h2 className="text-[18px] font-semibold text-[#0D1F29]">
                  {groupedQuizzes[selectedQuizId].questions[step - 1].question_content}
                </h2>
                <section className="flex flex-col gap-[16px] py-[8px]">
                  {groupedQuizzes[selectedQuizId].questions[step - 1].options?.map(
                    (item, index) => (
                      <SelectItem
                        key={index}
                        isSelected={selectQuizAnswer === item}
                        onClick={() => {
                          setSelectQuizAnswer(item);
                        }}
                      >
                        {item}
                      </SelectItem>
                    )
                  )}
                </section>
              </>
            )}
          </>
        )}

        {selectedQuizId &&
          groupedQuizzes[selectedQuizId] &&
          groupedQuizzes[selectedQuizId].questions[step - 1] && (
            <div className="flex justify-end w-full mt-[16px] mb-[8px]">
              <button
                className="w-[112px] h-[40px] bg-[#13A4EC] rounded-[12px] text-[16px] text-white font-bold cursor-pointer"
                onClick={onClickQuizSubmit}
              >
                정답 제출
              </button>
            </div>
          )}

        <div className="h-[1px] border border-[#E2E8F0]" />

        {selectedQuizId && groupedQuizzes[selectedQuizId] && (
          <div className="flex justify-center items-center gap-[70px] w-full">
            <button
              className="w-[143px] h-[40px] rounded-[12px] bg-[#13A4EC] text-[24px] text-white cursor-pointer"
              onClick={() => {
                if (step === 1) {
                  return;
                }
                setStep(step - 1);
                setSelectQuizAnswer(""); // 이전 문제로 이동 시 답안 초기화
              }}
            >
              이전페이지
            </button>
            <p>
              {step} / {groupedQuizzes[selectedQuizId].questions.length}
            </p>
            <button
              className="w-[143px] h-[40px] rounded-[12px] bg-[#13A4EC] text-[24px] text-white cursor-pointer"
              onClick={() => {
                const stepLimit = groupedQuizzes[selectedQuizId].questions.length;
                if (step === stepLimit) {
                  return;
                }
                setStep(step + 1);
                setSelectQuizAnswer(""); // 다음 문제로 이동 시 답안 초기화
              }}
            >
              다음페이지
            </button>
          </div>
        )}
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
