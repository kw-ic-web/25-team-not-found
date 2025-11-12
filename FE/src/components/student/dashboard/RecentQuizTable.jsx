import { twJoin } from "tailwind-merge";

export default function RecentQuizTable({ quizzes = [] }) {
  const getScoreMeta = (score) => {
    const parsedScore = parseInt(String(score).replace("%", ""));
    if (Number.isNaN(parsedScore)) {
      return {
        scoreColor: "text-[#0F172A]",
        status: "보통",
        statusColor: "bg-[#E2E8F0] text-[#334155]",
      };
    }
    if (parsedScore >= 80) {
      return {
        scoreColor: "text-[#10B981]",
        status: "통과",
        statusColor: "bg-[#10B981]/10 text-[#10B981]",
      };
    }
    if (parsedScore < 70) {
      return {
        scoreColor: "text-[#EF4444]",
        status: "재도전",
        statusColor: "bg-[#EF4444]/10 text-[#EF4444]",
      };
    }
    return {
      scoreColor: "text-[#0F172A]",
      status: "보통",
      statusColor: "bg-[#E2E8F0] text-[#334155]",
    };
  };

  return (
    <div className="mt-[8px] w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-[14px] font-bold text-[#64748B]">
            <th className="py-[8px]">퀴즈</th>
            <th className="py-[8px]">교재</th>
            <th className="py-[8px]">점수</th>
            <th className="py-[8px]">상태</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((q) => {
            const { scoreColor, status, statusColor } = getScoreMeta(q.score);
            return (
              <tr
                key={q.title}
                className="border-t border-[#E2E8F0] text-[14px]"
              >
                <td className="py-[8px] text-[#0F172A]">{q.title}</td>
                <td className="py-[8px] text-[#334155]">{q.subject}</td>
                <td className={twJoin("py-[8px] text-[14px]", scoreColor)}>
                  {q.score}
                </td>
                <td>
                  <div
                    className={twJoin(
                      "py-[3.5px] px-[8px] w-fit rounded-full text-[12px]",
                      statusColor
                    )}
                  >
                    {status}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
