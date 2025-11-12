import DummyProgressBar from "../../DummyProgressBar";

const MyProgressSummaryItem = ({ title, amount }) => {
  return (
    <div className="flex flex-col gap-[8px] flex-1 min-w-0">
      <div className="flex justify-between">
        <p className="font-semibold text-[14px]">{title}</p>
        <p className="text-[14px] text-[#64748B]">{amount}</p>
      </div>
      <DummyProgressBar />
    </div>
  );
};

export default MyProgressSummaryItem;
