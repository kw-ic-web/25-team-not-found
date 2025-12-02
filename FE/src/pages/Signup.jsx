// src/pages/Signup.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://team10-api.kwweb.org";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nickname: "",
    username: "",
    password: "",
    passwordConfirm: "",
  });
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setGeneralError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.nickname ||
      !form.username ||
      !form.password ||
      !form.passwordConfirm
    ) {
      setGeneralError("모든 필드를 입력해주세요.");
      return;
    }

    if (form.password !== form.passwordConfirm) {
      setGeneralError("비밀번호가 서로 일치하지 않습니다.");
      return;
    }

    try {
      setLoading(true);
      setGeneralError("");

      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
          nickname: form.nickname,
        }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch (_) {}

      if (!res.ok) {
        const msg =
          (data && data.message) || "회원가입 중 오류가 발생했습니다.";
        if (res.status === 409) {
          setGeneralError("이미 사용 중인 아이디/이메일입니다.");
        } else if (res.status >= 500) {
          setGeneralError("서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        } else {
          setGeneralError(msg);
        }
        return;
      }

      console.log("회원가입 성공:", data);
      alert("회원가입이 완료되었습니다. 로그인 페이지에서 로그인해주세요.");

      // 회원가입 성공 시 로그인 화면으로 이동
      navigate("/login"); 
    } catch (err) {
      console.error(err);
      setGeneralError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F3F4F6]">
      <div className="flex w-[448px] max-w-[448px] flex-col gap-6 rounded-[12px] bg-white p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col gap-2">
          <h2 className="w-full text-center text-[30px] font-bold leading-9 tracking-[-0.75px] text-[#111827]">
            계정을 생성하세요
          </h2>
          <p className="w-full text-center text-[14px] leading-5 text-[#4B5563]">
            교사와 학생의 1:1 학습을 위한 개인화 e-교재 플랫폼입니다.
          </p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <label className="flex flex-col gap-1 text-[16px] text-[#6B7280]">
            닉네임
            <input
              type="text"
              name="nickname"
              value={form.nickname}
              onChange={handleChange}
              className="h-[49px] w-full rounded-[8px] border border-[#D1D5DB] bg-[#F6F7F8] px-[17px] text-[14px] text-[#111827] focus:outline-none focus:ring-0"
            />
          </label>

          <label className="flex flex-col gap-1 text-[16px] text-[#6B7280]">
            아이디 또는 이메일
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="h-[49px] w-full rounded-[8px] border border-[#D1D5DB] bg-[#F6F7F8] px-[17px] text-[14px] text-[#111827] focus:outline-none focus:ring-0"
            />
          </label>

          <label className="flex flex-col gap-1 text-[16px] text-[#6B7280]">
            비밀번호
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="h-[49px] w-full rounded-[8px] border border-[#D1D5DB] bg-[#F6F7F8] px-[17px] text-[14px] text-[#111827] focus:outline-none focus:ring-0"
            />
          </label>

          <label className="flex flex-col gap-1 text-[16px] text-[#6B7280]">
            비밀번호 확인
            <input
              type="password"
              name="passwordConfirm"
              value={form.passwordConfirm}
              onChange={handleChange}
              className="h-[49px] w-full rounded-[8px] border border-[#D1D5DB] bg-[#F6F7F8] px-[17px] text-[14px] text-[#111827] focus:outline-none focus:ring-0"
            />
          </label>

          {generalError && (
            <p className="text-[12px] leading-4 text-[#DC2626]">
              {generalError}
            </p>
          )}

          <div className="mt-2 flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex h-[46px] w-full items-center justify-center rounded-[8px] bg-[#13A4EC] px-[17px] py-[13px] text-[14px] font-medium leading-5 text-white focus:outline-none focus:ring-0 disabled:opacity-70"
            >
              {loading ? "회원가입 중..." : "회원가입 완료"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")} 
              className="flex h-[46px] w-full items-center justify-center rounded-[8px] bg-[rgba(19,164,236,0.2)] px-[17px] py-[13px] text-[14px] font-medium leading-5 text-[#374151] focus:outline-none focus:ring-0"
            >
              로그인으로 돌아가기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
