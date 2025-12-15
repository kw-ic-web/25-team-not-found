import { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";

export default function WeeklyGoalEditModal({ open, onClose, api, currentTarget, onSaved }) {
  const [value, setValue] = useState(String(currentTarget ?? 0));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setValue(String(currentTarget ?? 0));
    setError("");
  }, [currentTarget, open]);

  const onChangeValue = (e) => {
    const raw = e.target.value;

    if (raw === "") {
      setValue("");
      setError("");
      return;
    }

    const onlyDigits = raw.replace(/[^\d]/g, "");
    setValue(onlyDigits);
    setError("");
  };

  const submit = async () => {
    const n = Number(value);

    if (!Number.isFinite(n) || !Number.isInteger(n)) {
      setError("목표 시간은 1시간 단위로 입력해주세요.");
      return;
    }
    if (n < 0) {
      setError("0 이상으로 입력해주세요.");
      return;
    }
    if (n > 168) {
      setError("주간 목표는 168시간을 넘을 수 없습니다.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      
      await api.put("/users/goal", { weekly_goal: n });

      onSaved?.(n);
      onClose?.();
    } catch (e) {
      setError(e?.response?.data?.message || "저장에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={saving ? undefined : onClose}
      BackdropProps={{ invisible: true }}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <div className="w-[520px] bg-white rounded-[16px] overflow-hidden border border-[#E2E8F0]">
        <div className="flex items-center justify-between px-[24px] py-[18px] border-b border-[#E2E8F0]">
          <h3 className="text-[16px] font-bold text-[#0F172A]">주간 학습시간 목표 설정</h3>
          <button
            type="button"
            onClick={saving ? undefined : onClose}
            className="text-[#64748B] text-[18px] leading-none"
          >
            ×
          </button>
        </div>

        <div className="px-[24px] py-[20px]">
          <p className="text-[12px] text-[#64748B] mb-[10px]">목표 시간을 입력하세요. (시간 단위)</p>

          <div className="flex items-center gap-[10px]">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              value={value}
              onChange={onChangeValue}
              className="flex-1 h-[44px] px-[12px] rounded-[8px] border border-[#CBD5E1] text-[14px] outline-none"
              placeholder="예: 6"
            />
            <span className="text-[14px] text-[#0F172A] font-medium whitespace-nowrap">시간</span>
          </div>

          {error && <p className="mt-[10px] text-[12px] text-[#DC2626]">{error}</p>}
        </div>

        <div className="flex justify-end gap-[10px] px-[24px] py-[16px] border-t border-[#E2E8F0]">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="h-[40px] px-[16px] rounded-[10px] border border-[#CBD5E1] text-[14px] font-semibold text-[#475569] disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={saving}
            className="h-[40px] px-[16px] rounded-[10px] bg-[#13A4EC] text-white text-[14px] font-semibold disabled:opacity-50"
          >
            저장
          </button>
        </div>
      </div>
    </Modal>
  );
}