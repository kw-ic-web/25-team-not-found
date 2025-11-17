import ic_logo from "../assets/icons/ic_logo.svg";

export default function TeacherStudent() {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-100 to-white">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/70 backdrop-blur-md">
          <div className="w-full max-w-screen-2xl mx-auto h-[68.5px] px-10 flex items-center justify-between">
            {/* Left: logo */}
            <div className="flex items-center gap-3 cursor-pointer">
              <img src={ic_logo} alt="EduNote logo" className="w-7 h-7 shrink-0" />
                <div className="text-[20px] leading-7 font-bold text-gray-900">EduNote</div>
               </div>
            
            

  
            {/* Right: dashboard link + user */}
            <div className="flex items-center gap-4">
              <a
                href="/"
                className="inline-flex items-center gap-2 h-10 px-3 rounded-md bg-neutral-100 text-neutral-800"
              >
                <span className="inline-block w-6 h-6 bg-neutral-900 rounded" />
                <span className="text-sm font-medium">대시보드</span>
              </a>
  
              <div className="flex items-center gap-3">
                <img
                  className="w-10 h-10 rounded-full object-cover"
                  
                />
                <div className="leading-tight">
                  <div className="text-base font-bold text-neutral-800">교사</div>
                  <button className="text-sm text-red-500">로그아웃</button>
                </div>
              </div>
            </div>
          </div>
        </header>
  
        {/* Main */}
        <div className="flex-1 flex">
          {/* Aside */}
          <aside className="w-[320px] p-6 space-y-8">
            {/* Title */}
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-neutral-800">학생 관리</h1>
              <p className="text-sm text-neutral-500">학생 데이터와 학업 현황을 관리하세요.</p>
            </div>
  
            {/* Nav */}
            <nav className="space-y-2">
              <a
                className="flex items-center gap-3 h-10 px-3 rounded-lg bg-sky-50 text-sky-600"
                href="#"
                aria-current="page"
              >
                <span className="inline-block w-6 h-6 rounded bg-sky-500/90" />
                <span className="text-base font-medium">전체 학생</span>
              </a>
              <a className="flex items-center gap-3 h-10 px-3 rounded-lg hover:bg-neutral-100" href="#">
                <span className="inline-block w-6 h-6 rounded bg-neutral-900/90" />
                <span className="text-base text-neutral-800">위기 학생</span>
              </a>
            </nav>
  
            {/* 검색 & 필터 */}
            <section className="relative">
              <h3 className="mb-4 text-[17.7px] font-bold text-neutral-800">검색 & 필터</h3>
  
              {/* 검색 */}
              <div className="relative mb-6">
                <input
                  className="w-full h-[41px] rounded-lg border border-neutral-300 bg-neutral-100 pl-10 pr-4 text-sm placeholder:text-neutral-400"
                  placeholder="학생 검색..."
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded bg-neutral-300" />
              </div>
  
              {/* 정렬 기준 */}
              <div className="mb-6 space-y-2">
                <label className="text-sm font-medium text-neutral-600">정렬 기준</label>
                <div className="relative">
                  <select className="w-full h-10 rounded-lg border border-neutral-300 bg-neutral-100 px-3 pr-8 text-[16px]">
                    <option>이름 (A-Z)</option>
                    <option>최근 접속</option>
                    <option>진도율</option>
                    <option>평균 퀴즈 점수</option>
                    <option>출석</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">⌄</span>
                </div>
              </div>
  
              {/* 상태 필터 */}
              <div className="space-y-2">
  <div className="text-sm font-medium text-neutral-600">상태 필터</div>

  <label className="flex items-center gap-2 text-neutral-800">
    <input
      type="checkbox"
      className="w-4 h-4 rounded-[4px] border border-neutral-500 accent-sky-500"
      value="active"
      defaultChecked
    />
    <span className="text-sm">활동</span>
  </label>

  <label className="flex items-center gap-2 text-neutral-800">
    <input
      type="checkbox"
      className="w-4 h-4 rounded-[4px] border border-neutral-500 accent-sky-500"
      value="inactive"
      defaultChecked
    />
    <span className="text-sm">비활동</span>
  </label>

  <label className="flex items-center gap-2 text-neutral-800">
    <input
      type="checkbox"
      className="w-4 h-4 rounded-[4px] border border-neutral-500 accent-sky-500"
      value="risk"
      defaultChecked
    />
    <span className="text-sm">위기</span>
  </label>
  </div>
            </section>
  
            {/* 여백 + 일괄 작업 */}
            <div className="grow" />
            <section className="space-y-3">
              <h3 className="text-lg font-bold text-neutral-800">일괄 작업</h3>
              <button className="w-full h-10 rounded-lg bg-sky-500 text-white text-sm font-medium hover:bg-sky-600">
                데이터 내보내기
              </button>
              <button className="w-full h-10 rounded-lg border border-neutral-300 text-neutral-800 text-sm hover:bg-neutral-50">
                선택 학생에게 메시지
              </button>
            </section>
          </aside>
  
          {/* Section (content) */}
          <section className="flex-1 min-w-0 px-40 py-8 overflow-y-auto">
            <div className="max-w-[1280px] mx-auto space-y-6">
              {/* Title */}
              <h2 className="text-2xl font-bold text-neutral-800">전체 학생</h2>
  
              {/* Table Card */}
              <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
                {/* thead */}
                <div className="bg-neutral-50">
                  <div className="grid grid-cols-[106.5px_319.5px_213px_213px_203.56px_121.69px_100.75px]">
                    <div className="px-4 py-3">
                      <input type="checkbox" className="w-4 h-4 rounded border-neutral-500" />
                    </div>
                    <div className="px-4 py-3 text-sm font-medium text-neutral-800">이름</div>
                    <div className="px-4 py-3 text-sm font-medium text-neutral-800">최근 접속</div>
                    <div className="px-4 py-3 text-sm font-medium text-neutral-800">진도율</div>
                    <div className="px-4 py-3 text-sm font-medium text-neutral-800">평균 퀴즈 점수</div>
                    <div className="px-4 py-3 text-sm font-medium text-neutral-800">출석</div>
                    <div className="px-4 py-3 text-sm font-medium text-neutral-800">작업</div>
                  </div>
                </div>
  
                {/* tbody — Row 1: Sophia Carter */}
                <div className="divide-y divide-neutral-200">
                  <div className="grid grid-cols-[106.5px_319.5px_213px_213px_203.56px_121.69px_100.75px] h-[64.5px]">
                    <div className="px-4 py-6">
                      <input type="checkbox" className="w-4 h-4 rounded border-neutral-500" />
                    </div>
  
                    <div className="px-4 py-3">
                      <div className="text-[16px] font-medium text-neutral-800 leading-5">Sophia Carter</div>
                      <div className="text-sm text-neutral-500">sophia.carter@email.com</div>
                    </div>
  
                    <div className="px-4 py-4">
                      <div className="text-sm text-neutral-500">2일 전</div>
                    </div>
  
                    {/* 진도율 */}
                    <div className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="relative w-24 h-2 rounded-full bg-neutral-300">
                          <div className="absolute inset-y-0 left-0 rounded-full bg-sky-500" style={{ width: "75%" }} />
                        </div>
                        <span className="text-sm font-medium text-neutral-800">75%</span>
                      </div>
                    </div>
  
                    {/* 평균 퀴즈 */}
                    <div className="px-4 py-4">
                      <span className="text-sm font-medium text-neutral-800">88%</span>
                    </div>
  
                    {/* 출석 */}
                    <div className="px-4 py-4">
                      <span className="text-sm font-medium text-neutral-800">95%</span>
                    </div>
  
                    {/* 작업 */}
                    <div className="px-4 py-4">
                      <button className="text-sm font-medium text-sky-600 hover:underline">보기</button>
                    </div>
                  </div>
  
                  {/* Row 2: Ethan Bennett */}
                  <div className="grid grid-cols-[106.5px_319.5px_213px_213px_203.56px_121.69px_100.75px] h-[65px]">
                    <div className="px-4 py-6">
                      <input type="checkbox" className="w-4 h-4 rounded border-neutral-500" />
                    </div>
  
                    <div className="px-4 py-3">
                      <div className="text-[16px] font-medium text-neutral-800 leading-5">Ethan Bennett</div>
                      <div className="text-sm text-neutral-500">ethan.bennett@email.com</div>
                    </div>
  
                    <div className="px-4 py-4">
                      <div className="text-sm text-neutral-500">1주 전</div>
                    </div>
  
                    <div className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="relative w-24 h-2 rounded-full bg-neutral-300">
                          <div className="absolute inset-y-0 left-0 rounded-full bg-sky-500" style={{ width: "50%" }} />
                        </div>
                        <span className="text-sm font-medium text-neutral-800">50%</span>
                      </div>
                    </div>
  
                    <div className="px-4 py-4">
                      <span className="text-sm font-medium text-neutral-800">65%</span>
                    </div>
  
                    <div className="px-4 py-4">
                      <span className="text-sm font-medium text-neutral-800">80%</span>
                    </div>
  
                    <div className="px-4 py-4">
                      <button className="text-sm font-medium text-sky-600 hover:underline">보기</button>
                    </div>
                  </div>
  
                  {/* Row 3: Liam Foster */}
                  <div className="grid grid-cols-[106.5px_319.5px_213px_213px_203.56px_121.69px_100.75px] h-[65px]">
                    <div className="px-4 py-6">
                      <input type="checkbox" className="w-4 h-4 rounded border-neutral-500" />
                    </div>
  
                    <div className="px-4 py-3">
                      <div className="text-[16px] font-medium text-neutral-800 leading-5">Liam Foster</div>
                      <div className="text-sm text-neutral-500">liam.foster@email.com</div>
                    </div>
  
                    <div className="px-4 py-4">
                      <div className="text-sm text-neutral-500">3일 전</div>
                    </div>
  
                    <div className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="relative w-24 h-2 rounded-full bg-neutral-300">
                          <div className="absolute inset-y-0 left-0 rounded-full bg-sky-500" style={{ width: "60%" }} />
                        </div>
                        <span className="text-sm font-medium text-neutral-800">60%</span>
                      </div>
                    </div>
  
                    <div className="px-4 py-4">
                      <span className="text-sm font-medium text-neutral-800">70%</span>
                    </div>
  
                    <div className="px-4 py-4">
                      <span className="text-sm font-medium text-neutral-800">85%</span>
                    </div>
  
                    <div className="px-4 py-4">
                      <button className="text-sm font-medium text-sky-600 hover:underline">보기</button>
                    </div>
                  </div>
  
                  {/* Row 4 (위기행 강조): Ava Coleman */}
                  <div className="grid grid-cols-[106.5px_319.5px_213px_213px_203.56px_121.69px_100.75px] h-[64.5px] bg-red-50">
                    <div className="px-4 py-6">
                      <input type="checkbox" className="w-4 h-4 rounded border-neutral-500" />
                    </div>
  
                    <div className="px-4 py-3">
                      <div className="text-[16px] font-medium text-red-700 leading-5">Ava Coleman</div>
                      <div className="text-sm text-red-500">ava.coleman@email.com</div>
                    </div>
  
                    <div className="px-4 py-4">
                      <div className="text-sm text-red-600">2주 전</div>
                    </div>
  
                    <div className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="relative w-24 h-2 rounded-full bg-red-200">
                          <div className="absolute inset-y-0 left-0 rounded-full bg-red-500" style={{ width: "40%" }} />
                        </div>
                        <span className="text-sm font-medium text-red-700">40%</span>
                      </div>
                    </div>
  
                    <div className="px-4 py-4">
                      <span className="text-sm font-medium text-red-700">55%</span>
                    </div>
  
                    <div className="px-4 py-4">
                      <span className="text-sm font-medium text-red-700">70%</span>
                    </div>
  
                    <div className="px-4 py-4">
                      <button className="text-sm font-medium text-sky-600 hover:underline">보기</button>
                    </div>
                  </div>
                </div>
              </div>
  

              
                
              
            </div>
          </section>
        </div>
      </div>
    )
  }
  