import ic_logo from "../assets/icons/ic_logo.svg";
export default function TeacherLecture() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-100 to-white">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 h-16 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto h-full max-w-screen-xl px-6 flex items-center justify-between">
          {/* 왼 */}
          <div className="flex items-center gap-3">
            <button
              className="inline-flex items-center gap-2 h-9 px-3 rounded-lg bg-sky-500 text-white shadow-sm"
              onClick={() => history.back()}
            >

              <span className="inline-block w-4 h-4 border-b-2 border-l-2 rotate-45 -translate-y-px" />
              <span className="text-sm font-medium">뒤로가기</span>
            </button>

            <div className="flex items-center gap-3 cursor-pointer">
  <img src={ic_logo} alt="EduNote logo" className="w-7 h-7 shrink-0" />
  <div className="text-[20px] leading-7 font-bold text-gray-900">EduNote</div>
</div>
            </div>

          {/* 오른쪽 */}
          <div className="flex items-center gap-4">
            <a href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100">
              <div className="w-6 h-6 rounded bg-gray-600/90" />
              <span className="text-sm text-gray-600">대시보드</span>
            </a>

            <button className="inline-flex items-center gap-2 h-10">
              <img
                className="w-10 h-10 rounded-full object-cover"
                
                alt="사용자"
              />
              <span className="text-sm font-semibold text-gray-800">사용자</span>
              <span className="w-6 h-6 grid place-items-center text-gray-500">▾</span>
            </button>

            <button className="inline-flex items-center h-10 px-4 rounded-lg bg-sky-500 text-white hover:bg-sky-600 text-sm shadow">
              저장
            </button>
          </div>
        </div>
      </header>

      {/* 메인 컨테이너 마진 */}
      <main className="flex-1">
        <div className="mx-auto max-w-screen-xl px-6 py-8">
          {/* 제목 */}
          <div className="mb-8">
            <h2 className="text-[30px] leading-9 font-bold text-slate-900">수업 시작</h2>
          </div>

          {/* 컬럼 */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-8">
            
            <div className="grid grid-cols-1 gap-8">
              {/* 수업 설정 */}
              <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                <h3 className="text-[20px] leading-7 font-semibold text-slate-800 mb-4">수업 설정</h3>

                <div className="grid gap-6">
                  {/* 교재/수업 선택 */}
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-600">수업 내용</label>
                    <div className="relative">
                      <select
                        className="w-full h-10 rounded-lg border border-slate-300 bg-gray-100 px-3 pr-9 text-[16px] text-slate-800"
                        defaultValue=""
                      >
                        <option value="" disabled>교재 또는 수업 선택</option>
                        <option value="algebra">대수학 복습</option>
                        <option value="design">현대 디자인의 원리</option>
                      </select>
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">⌄</span>
                    </div>
                  </div>

                  {/* 세션 제목 */}
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-600">세션 제목(선택)</label>
                    <input
                      className="w-full h-10 rounded-lg border border-slate-300 bg-gray-100 px-3 text-[16px] placeholder:text-gray-500"
                      placeholder="예: 대수학 기초 복습"
                    />
                  </div>

                  {/* 세션 설명 */}
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-600">세션 설명(선택)</label>
                    <textarea
                      className="w-full min-h-[90px] rounded-lg border border-slate-300 bg-gray-100 px-3 py-2 text-[16px] placeholder:text-gray-500"
                      placeholder="..."
                    />
                  </div>

                  {/* 예상 수업 시간  */}
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-600">예상 수업 시간: 45분</label>
                    <div className="w-full h-2 bg-slate-300 rounded-lg">
                      <div className="h-2 w-1/2 bg-sky-500 rounded-lg" />
                    </div>
                  </div>
                </div>
              </section>

              {/* 메모/지시사항 */}
              <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                <h3 className="text-[20px] leading-7 font-semibold text-slate-800 mb-4">
                  세션 메모/지시사항(선택)
                </h3>
                <textarea
                  className="w-full min-h-[114px] rounded-lg border border-slate-300 bg-gray-100 px-3 py-2 text-[16px] placeholder:text-gray-500"
                  placeholder="수업 중 참고할 개인 메모나 지시사항을 입력하세요..."
                />
              </section>
            </div>

            {/* 오른쪽 */}
            <aside className="grid grid-cols-1 gap-8">
              {/* 학생 매칭 */}
              <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                <h3 className="text-[20px] leading-7 font-semibold text-slate-800 mb-4">
                  학생 매칭
                </h3>

                <div className="rounded-lg bg-amber-50 text-amber-600 px-3 py-3 mb-3 inline-flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-amber-600/20 grid place-items-center">
                    <span className="text-[12px]">!</span>
                  </div>
                  <span className="text-sm font-medium">연결 상태: 학생 대기 중...</span>
                </div>

                <p className="text-sm text-slate-500 mb-3">
                  배정 학생 자동 매칭: <span className="text-slate-600">Liam Carter</span>
                </p>

                <button className="w-full h-10 rounded-lg bg-sky-50 text-sky-600 font-semibold hover:bg-sky-100">
                  학생 수동 초대
                </button>
              </section>

              {/* 연결 상태 */}
              <section className="relative bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                <h3 className="text-[20px] leading-7 font-semibold text-slate-800 mb-4">연결 상태</h3>

                <div className="grid gap-3">
                  {/* 더미 1 */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">학생 연결:</span>
                    <span className="inline-flex items-center gap-2">
                      <span className="inline-block w-4 h-4 rounded bg-red-600/10 border border-red-600" />
                      <span className="text-sm font-medium text-red-600">연결 안 됨</span>
                    </span>
                  </div>

                  {/* 더미 2 */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">준비 상태:</span>
                    <span className="inline-flex items-center gap-2">
                      <span className="inline-block w-4 h-4 rounded bg-red-600/10 border border-red-600" />
                      <span className="text-sm font-medium text-red-600">준비 안 됨</span>
                    </span>
                  </div>
                </div>
              </section>
            </aside>
          </div>

          {/* 연결 시 */}
          <div className="mt-8 flex items-start justify-end">
            <button
              disabled
              className="inline-flex items-center gap-3 h-13 px-8 py-3 rounded-lg bg-slate-300 text-slate-600 font-bold shadow-md disabled:opacity-100"
              title="학생이 연결되어 준비 완료되면 활성화됩니다."
            >
              <span className="w-6 h-6 rounded bg-slate-500/40" />
              수업 시작
            </button>
          </div>

          {/* 배너 */}
          <div className="mt-4 rounded-r-lg bg-sky-50 border-l-4 border-sky-300 px-5 py-4">
            <p className="text-sky-600 font-semibold">
              개발 메모: 학생이 연결되어 준비 완료되면 ‘수업 시작’ 버튼이 활성화됩니다.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
