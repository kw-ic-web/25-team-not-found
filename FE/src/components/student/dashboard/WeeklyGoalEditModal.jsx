import { useEffect, useMemo, useState } from "react";
import Modal from "@mui/material/Modal";

const WeeklyGoalEditModal = ({ open, onClose, currentTarget, api, onSaved }) => {
  const initial = useMemo(() => {
    const n = Number(currentTarget);
    return Number.isFinite(n) ? n : 0;
  }, [currentTarget]);

  const [goal, setGoal] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setGoal(initial);
    setSaving(false);
    setError("");
  }, [open, initial]);

  const handleSave = async () => {
    const n = Number(goal);

    if (!Number.isFinite(n) || n < 0) {
      setError("0 이상의 숫자를 입력해주세요.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      // PUT /users/goal  { weekly_goal: 10 }
      const res = await api.put("/users/goal", { weekly_goal: n });

      // 응답: { weekly_goal_hours: 10 }
      const updated = Number(res?.data?.weekly_goal_hours ?? n);

      onSaved?.(Number.isFinite(updated) ? updated : n);
      onClose?.();
    } catch (e) {
      setError(e?.response?.data?.message || "목표 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={saving ? undefined : onClose}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <div className="w-[520px] bg-white rounded-[16px] overflow-hidden">
        <div className="flex justify-between items-center p-[20px] border-b border-[#E2E8F0]">
          <h2 className="text-[18px] font-bold text-[#0F172A]">주간 학습시간 목표 설정</h2>
          <button
            className="text-[20px] text-[#64748B] hover:text-[#0F172A]"
            onClick={onClose}
            disabled={saving}
          >
            ×
          </button>
        </div>

        <div className="p-[20px]">
          <p className="text-[12px] text-[#64748B] mb-[10px]">
            목표 시간을 입력하세요. (시간 단위)
          </p>

          <div className="flex items-center gap-[10px]">
            <input
              type="number"
              min={0}
              step={0.5}
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full h-[44px] px-[12px] rounded-[10px] border border-[#E2E8F0] focus:outline-none focus:border-[#13A4EC]"
              disabled={saving}
              placeholder="예) 5"
            />
            <span className="text-[14px] text-[#0F172A]">시간</span>
          </div>

          {error && <p className="mt-[10px] text-[12px] text-[#DC2626]">{error}</p>}
        </div>

        <div className="flex justify-end gap-[10px] p-[20px] border-t border-[#E2E8F0]">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-[16px] py-[10px] rounded-[10px] border border-[#CBD5E1] text-[14px] font-semibold text-[#475569] hover:bg-[#F1F5F9] disabled:opacity-50"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-[16px] py-[10px] rounded-[10px] bg-[#13A4EC] text-white text-[14px] font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default WeeklyGoalEditModal;