export default function Login() {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#D8EEFF]">
        <div className="bg-[#F5F6FA] w-[1500px] h-[900px] flex flex-col justify-center items-center rounded-[8px]">
          {/* EduNote */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">EduNote</h1>
            <p className="text-gray-500 mt-1">1:1 학습을 위한 완성형 교과서</p>
          </div>
  
          {/* 로그인 */}
          <div className="bg-white p-8 rounded-xl shadow-md w-[400px] flex flex-col gap-3">
            <input
              type="text"
              placeholder="아이디/이메일"
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="비밀번호"
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
  
            <button className="bg-[#23A3FF] hover:bg-[#0F8DDF] text-white py-2 rounded-md font-semibold mt-1">
              로그인
            </button>
  
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-md font-medium">
              회원가입
            </button>
  
            <a
              href="#"
              className="text-center text-sm text-gray-500 hover:underline mt-2"
            >
              비밀번호를 잊으셨나요?
            </a>
          </div>
        </div>
      </div>
    );
  }
  