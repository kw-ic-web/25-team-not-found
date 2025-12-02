import { useNavigate } from "react-router-dom";

export default function StartClassModal({ open, onClose, onConfirm }) {
  const navigate = useNavigate();

  if (!open) return null; // 열려있지 않으면 아무것도 렌더하지 않기

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    navigate("/teacher/lecture"); 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {/* 모달 카드 */}
      <div className="w-[440px] max-w-[448px] rounded-2xl bg-white border border-slate-200 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] p-6">
        {/* 제목 */}
        <h2 className="text-[20px] leading-[28px] font-bold text-slate-900">
          수업을 시작하시겠습니까?
        </h2>

        {/* 설명 */}
        <p className="mt-2 text-[14px] leading-[20px] text-slate-600">
          학생과의 실시간 화상 수업을 시작합니다. 선택한 교재와 설정으로
          수업 화면으로 이동합니다.
        </p>

        {/* 버튼 영역 */}
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-[38px] px-[17px] rounded-lg border border-slate-300 bg-white text-[14px] font-medium text-slate-700"
          >
            아니요
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="h-[38px] px-4 rounded-lg bg-[#13A4EC] text-[14px] font-semibold text-white shadow-sm"
          >
            네, 수업 시작
          </button>
        </div>
      </div>
    </div>
  );
}
