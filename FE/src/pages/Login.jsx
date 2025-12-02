import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://223.194.46.67:21090";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");

    if (!username || !password) {
      setGeneralError("아이디/이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg =
          data?.message || "로그인에 실패했습니다. 아이디/비밀번호를 확인해주세요.";
        setGeneralError(msg);
        return;
      }

      console.log("로그인 성공:", data);

      if (data?.access_token) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("token_type", data.token_type || "Bearer");
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      }

      // 첫 로그인 후 역할 선택 페이지
      navigate("/teacher");
    } catch (err) {
      console.error(err);
      setGeneralError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-[376px] bg-[#F3F4F6]">
      {/* 448 x 448 컨테이너 */}
      <div className="flex h-[448px] w-[448px] max-w-[448px] flex-col gap-8">
        {/* 제목 + 서브타이틀 (72px) */}
        <div className="flex h-[72px] w-full flex-col gap-2">
          <div className="flex h-10 w-full items-center justify-center">
            <h1 className="text-center text-[36px] font-bold leading-10 text-black">
              EduNote
            </h1>
          </div>
          <div className="flex h-6 w-full items-center justify-center">
            <p className="text-center text-[16px] font-normal leading-6 text-[#4B5563]">
              1:1 학습을 위한 맞춤형 교과서
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex h-[344px] w-[448px] flex-col items-start rounded-[12px] bg-white p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]"
        >
          <div className="flex h-[280px] w-[384px] flex-col gap-4">

            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setGeneralError("");
              }}
              placeholder="아이디/이메일"
              className="box-border h-[49px] w-full border border-[#6B7280] bg-white px-[17px] pt-[15px] pb-[13px] text-[16px] leading-[19px] text-[#6B7280] focus:border-[#6B7280] focus:outline-none focus:ring-0"
            />

            {/* 비밀번호 */}
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setGeneralError("");
              }}
              placeholder="비밀번호"
              className="box-border h-[49px] w-full border border-[#6B7280] bg-white px-[17px] pt-[15px] pb-[13px] text-[16px] leading-[19px] text-[#6B7280] focus:border-[#6B7280] focus:outline-none focus:ring-0"
            />

            {/* 에러 */}
            {generalError && (
              <p className="text-[12px] leading-4 text-[#DC2626]">
                {generalError}
              </p>
            )}

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-[44px] w-full items-center justify-center rounded-[8px] bg-[#13A4EC] px-4 py-3 text-center text-[14px] font-semibold leading-5 text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] focus:outline-none focus:ring-0 disabled:opacity-70"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>

            {/* 회원가입 버튼 */}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="flex h-[44px] w-[380px] items-center justify-center self-center rounded-[8px] bg-[#E5E7EB] px-[164px] py-3 text-center text-[14px] font-semibold leading-5 text-black shadow-[0_1px_2px_rgba(0,0,0,0.05)] focus:outline-none focus:ring-0"
            >
              회원가입
            </button>

            {/* 비밀번호 찾기 (일단 동작 없음) */}
            <button
              type="button"
              className="flex h-5 w-[82px] items-center justify-center self-center text-center text-[14px] leading-5 text-[#4B5563] underline focus:outline-none focus:ring-0"
            >
              비밀번호 찾기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
