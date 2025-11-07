import ic_quiz_random from "../../../assets/icons/ic_quiz_random.svg";

const QuizShortcutItem = ({ title, quizAmount, questionsAmount, limit }) => {
  return (
    <div className="flex gap-[12px] p-[17px] w-[322px] h-[70px] rounded-[16px] border border-[#E2E8F0]">
      <img src={ic_quiz_random} alt="quiz" />
      <div>
        <p className="text-[14px] font-semibold text-[#0F172A]">
          {title} · 퀴즈 {quizAmount}
        </p>
        <p className="text-[12px] text-[#64748B]">
          문항 {questionsAmount} · 제한 {limit}
        </p>
      </div>
    </div>
  );
};

export default QuizShortcutItem;
