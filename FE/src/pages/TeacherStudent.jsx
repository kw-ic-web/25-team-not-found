import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ic_logo from "../assets/icons/ic_logo.svg";

  const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://team10-api.kwweb.org";

export default function TeacherStudent() {
  const navigate = useNavigate();

  // 로그인 유저 정보 
  const [user, setUser] = useState(null);

  // 학생 목록 / 교재 상태
  const [students, setStudents] = useState([]);
  const [apiStatus, setApiStatus] = useState(""); // 학생 목록 API 상태

  const [textbooks, setTextbooks] = useState([]); // 내 교재 목록
  const [textbookStatus, setTextbookStatus] = useState(""); // 교재 목록 API 상태

  const [selectedTextbookId, setSelectedTextbookId] = useState("");
  const [selectedVersion, setSelectedVersion] = useState("");

  // 로그인 유저 정보 로드
  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) {
      navigate("/login");
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setUser(parsed);
    } catch (e) {
      console.error("user 파싱 실패:", e);
      navigate("/login");
    }
  }, [navigate]);

  // 현재 선택된 교재 제목
  const selectedTextbookTitle = useMemo(() => {
    const found = textbooks.find((t) => t.textbook_id === selectedTextbookId);
    return found ? found.title : "";
  }, [textbooks, selectedTextbookId]);

  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // 대시보드 이동
  const goDashboard = () => {
    navigate("/teacher");
  };

  // 내 교재 목록 불러오기
  useEffect(() => {
    async function fetchTextbooks() {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setTextbookStatus("access_token이 없어 교재 목록을 불러올 수 없습니다.");
          return;
        }

        const url = `${API_BASE_URL}/textbooks/mine`;
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // 명세서대로 Bearer 토큰
          },
        });

        console.log("교재 목록 API status:", res.status);

        if (!res.ok) {
          setTextbookStatus(`교재 목록 API 호출 실패 (status: ${res.status})`);
          return;
        }

        const data = await res.json();
        setTextbooks(data);

        if (data.length === 0) {
          setTextbookStatus("생성된 교재가 없습니다. 교재를 먼저 만들어야 합니다.");
          return;
        }

        setTextbookStatus(`교재 ${data.length}개 로드 완료`);

        // 기본 선택: 첫 번째 교재
        setSelectedTextbookId(data[0].textbook_id);
        setSelectedVersion(data[0].latest_version ?? 1);
      } catch (err) {
        console.error("교재 목록을 불러오지 못했습니다.", err);
        setTextbookStatus("교재 목록 API 호출 중 에러 발생");
      }
    }

    fetchTextbooks();
  }, []);

  // 학생 목록 불러오기
  useEffect(() => {
    async function fetchStudents() {
      try {
        if (!selectedTextbookId || !selectedVersion) {
          setApiStatus("교재가 선택되지 않아 학생 목록을 불러오지 않았습니다.");
          setStudents([]);
          return;
        }

        const token = localStorage.getItem("access_token");
        if (!token) {
          setApiStatus("access_token이 없어 학생 목록을 불러올 수 없습니다.");
          setStudents([]);
          return;
        }

        const url = `${API_BASE_URL}/teacher/${selectedTextbookId}/students?version=${selectedVersion}`;

        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // 명세서대로 Bearer 토큰
          },
        });

        console.log("학생 목록 API status:", res.status);

        if (!res.ok) {
          setApiStatus(`학생 목록 API 호출 실패 (status: ${res.status})`);
          setStudents([]);
          return;
        }

        const data = await res.json();
        console.log("학생 목록 API data:", data);

        const list = data?.students ?? [];
        setStudents(list);
        setApiStatus(`학생 목록 API 호출 성공 / 학생 수: ${list.length}명`);
      } catch (err) {
        console.error("학생 목록을 불러오지 못했습니다.", err);
        setApiStatus("학생 목록 API 호출 중 에러 발생");
        setStudents([]);
      }
    }

    // 교재 또는 버전이 바뀔 때마다 호출
    fetchStudents();
  }, [selectedTextbookId, selectedVersion]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-100 to-white">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white/70 backdrop-blur-md">
        <div className="w-full max-w-screen-2xl mx-auto h-[68.5px] px-10 flex items-center justify-between">
          {/* 왼쪽*/}
          <div className="flex items-center gap-3 cursor-pointer" onClick={goDashboard}>
          <img src={ic_logo} alt="EduNote" className="w-9 h-9 shrink-0" />
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 truncate">
              EduNote · 학생 관리
            </h1>
          </div>

          {/* 오른쪽 */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={goDashboard}
              className="inline-flex items-center gap-2 h-10 px-3 rounded-md bg-neutral-100 text-neutral-800"
            >
              <span className="text-sm font-medium">대시보드</span>
            </button>

            <div className="flex items-center gap-3">
              <img className="w-10 h-10 rounded-full object-cover" />
              <div className="leading-tight">
                <div className="text-base font-bold text-neutral-800">
                  {user?.nickname || "교사"}
                </div>
                <button
                  type="button"
                  className="text-sm text-red-500"
                  onClick={handleLogout}
                >
                  로그아웃
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* 사이드 바 */}
        <aside className="w-[320px] p-6 space-y-8">
          {/* 제목 */}
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-neutral-800">학생 관리</h1>
            <p className="text-sm text-neutral-500">
              학생 데이터와 학업 현황을 관리하세요.
            </p>
          </div>

          {/* 교재 선택 */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-neutral-700">교재 선택</h3>

            {textbookStatus && (
              <p className="text-xs text-neutral-500">{textbookStatus}</p>
            )}

            {textbooks.length > 0 && (
              <div className="mt-1 max-h-40 space-y-1 overflow-y-auto pr-1">
                {textbooks.map((tb) => {
                  const isActive = tb.textbook_id === selectedTextbookId;
                  return (
                    <button
                      key={tb.textbook_id}
                      type="button"
                      onClick={() => {
                        setSelectedTextbookId(tb.textbook_id);
                        setSelectedVersion(tb.latest_version ?? 1);
                      }}
                      className={
                        "flex w-full flex-col items-start rounded-lg px-3 py-2 text-left text-sm " +
                        (isActive
                          ? "bg-sky-50 border border-sky-400 text-sky-700"
                          : "bg-neutral-50 hover:bg-neutral-100 border border-transparent text-neutral-800")
                      }
                    >
                      <span className="font-medium truncate">{tb.title}</span>
                      <span className="mt-0.5 text-[11px] text-neutral-500">
                        ID: {String(tb.textbook_id).slice(0, 8)}… / 최신 버전:{" "}
                        {tb.latest_version ?? 1}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* Nav */}
          <nav className="space-y-2">
            <a
              className="flex items-center gap-3 h-10 px-3 rounded-lg bg-sky-50 text-sky-600"
              href="#"
              aria-current="page"
            >
              <span className="inline-block w-4 h-4 rounded bg-sky-500/90" />
              <span className="text-base font-medium">전체 학생</span>
            </a>
            <a
              className="flex items-center gap-3 h-10 px-3 rounded-lg hover:bg-neutral-100"
              href="#"
            >
              <span className="inline-block w-4 h-4 rounded bg-neutral-900/90" />
              <span className="text-base text-neutral-800">위기 학생</span>
            </a>
          </nav>

          {/* 검색 & 필터 */}
          <section className="relative">
            <h3 className="mb-4 text-[17.7px] font-bold text-neutral-800">
              검색 & 필터
            </h3>

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
              <label className="text-sm font-medium text-neutral-600">
                정렬 기준
              </label>
              <div className="relative">
                <select className="w-full h-10 rounded-lg border border-neutral-300 bg-neutral-100 px-3 pr-8 text-[16px]">
                  <option>이름 (A-Z)</option>
                  <option>최근 접속</option>
                  <option>진도율</option>
                  <option>평균 퀴즈 점수</option>
                  <option>출석</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
                  ⌄
                </span>
              </div>
            </div>

            {/* 상태 필터 */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-neutral-600">
                상태 필터
              </div>

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

        {/* 학생 테이블 */}
        <section className="flex-1 min-w-0 px-40 py-8 overflow-y-auto">
          <div className="max-w-[1280px] mx-auto space-y-6">
            {/* 제목 + API 상태 */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-800">전체 학생</h2>
              {selectedTextbookTitle && (
                <p className="mt-0.5 text-sm text-neutral-600">
                  선택된 교재:{" "}
                  <span className="font-semibold">{selectedTextbookTitle}</span>{" "}
                  (version: {selectedVersion || "?"})
                </p>
              )}
              {apiStatus && (
                <p className="mt-1 text-xs text-neutral-500">{apiStatus}</p>
              )}
            </div>

            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
              {/* 헤더 row */}
              <div className="bg-neutral-50">
                <div className="grid grid-cols-[106.5px_319.5px_213px_213px_203.56px_121.69px_100.75px]">
                  <div className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-neutral-500"
                    />
                  </div>
                  <div className="px-4 py-3 text-sm font-medium text-neutral-800">
                    이름
                  </div>
                  <div className="px-4 py-3 text-sm font-medium text-neutral-800">
                    최근 접속
                  </div>
                  <div className="px-4 py-3 text-sm font-medium text-neutral-800">
                    진도율
                  </div>
                  <div className="px-4 py-3 text-sm font-medium text-neutral-800">
                    평균 퀴즈 점수
                  </div>
                  <div className="px-4 py-3 text-sm font-medium text-neutral-800">
                    출석
                  </div>
                  <div className="px-4 py-3 text-sm font-medium text-neutral-800">
                    작업
                  </div>
                </div>
              </div>

              {/* 데이터 row들 */}
              <div className="divide-y divide-neutral-200">
                {students.map((s) => {
                  const isDanger = s.risk === "danger";
                  const rowClass = isDanger ? "bg-red-50" : "";
                  const nameClass = isDanger
                    ? "text-[16px] font-medium text-red-700 leading-5"
                    : "text-[16px] font-medium text-neutral-800 leading-5";
                  const emailClass = isDanger
                    ? "text-sm text-red-500"
                    : "text-sm text-neutral-500";
                  const recentClass = isDanger
                    ? "text-sm text-red-600"
                    : "text-sm text-neutral-500";
                  const barBg = isDanger ? "bg-red-200" : "bg-neutral-300";
                  const barFill = isDanger ? "bg-red-500" : "bg-sky-500";
                  const mainText = isDanger
                    ? "text-sm font-medium text-red-700"
                    : "text-sm font-medium text-neutral-800";

                  return (
                    <div
                      key={s.id ?? s.user_id}
                      className={`grid grid-cols-[106.5px_319.5px_213px_213px_203.56px_121.69px_100.75px] h-[65px] ${rowClass}`}
                    >
                      <div className="px-4 py-6">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-neutral-500"
                        />
                      </div>

                      {/* 이름 / 이메일 */}
                      <div className="px-4 py-3">
                        <div className={nameClass}>{s.nickname}</div>
                        <div className={emailClass}>{s.email}</div>
                      </div>

                      {/* 최근 접속 */}
                      <div className="px-4 py-4">
                        <div className={recentClass}>{s.last_accessed}</div>
                      </div>

                      {/* 진도율 */}
                      <div className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`relative w-24 h-2 rounded-full ${barBg}`}
                          >
                            <div
                              className={`absolute inset-y-0 left-0 rounded-full ${barFill}`}
                              style={{
                                width: `${s.progress_pct ?? 0}%`,
                              }}
                            />
                          </div>
                          <span className={mainText}>
                            {s.progress_pct ?? 0}%
                          </span>
                        </div>
                      </div>

                      {/* 평균 퀴즈 점수 */}
                      <div className="px-4 py-4">
                        <span className={mainText}>
                          {s.avg_quiz_score ?? 0}%
                        </span>
                      </div>

                      {/* 출석 */}
                      <div className="px-4 py-4">
                        <span className={mainText}>
                          {s.attendance_pct ?? 0}%
                        </span>
                      </div>

                      {/* 작업 */}
                      <div className="px-4 py-4">
                        <button className="text-sm font-medium text-sky-600 hover:underline">
                          보기
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* 학생이 하나도 없을 때 */}
                {students.length === 0 && (
                  <div className="px-4 py-6 text-sm text-neutral-500">
                    표시할 학생 데이터가 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
