import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import TeacherSidebar from "../components/sidebar/TeacherSidebar";
import StartClassModal from "../components/teacher/StartClassModal";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://team10-api.kwweb.org";

export default function TeacherMain() {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [students, setStudents] = useState([]);
  
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/textbooks/mine");
        const mapped = data.map((b) => ({
          id: b.textbook_id,
          title: b.title,
          updatedAt: b.created_at,
          latestVersion: b.latest_version,
          img: null,
        }));
        setBooks(mapped);
      } catch {
        console.error("ERROR: fetch books failed");
      }
    })();
  }, []);
  
  useEffect(() => {
    if (!books.length) {
      setStudents([]);
      return;
    }
  
    const firstBook = books[0];
  
    (async () => {
      try {
        const { data } = await api.get(`/teacher/${firstBook.id}/students`, {
          params: {
            version: firstBook.latestVersion,
            sort: "recent",
            order: "desc",
            limit: 10,
            offset: 0,
          },
        });
  
        const mappedStudents = (data.students || []).map((s) => ({
          id: s.user_id,
          name: s.nickname || s.username,
          email: s.username,
          recent: s.last_accessed,
          평균: s.latest_score,
          상태:
            s.latest_score == null
              ? "주의"
              : s.latest_score >= 90
              ? "우수"
              : "활성",
        }));
  
        setStudents(mappedStudents);
      } catch {
        console.error("ERROR: fetch students failed");
      }
    })();
  }, [books]);

  const [filters, setFilters] = useState({
    bookSort: "최근 수정순",
    quickBook: "교재명",
    unit: "단원 ",
    mode: "발표",
    studentQuery: "",
  });

  const handleCreateBook = async () => {
    try {
      const { data } = await api.post("/textbooks", {
        title: "새 교재",
      });
      navigate("/teacher/book", {
        state: { textbookId: data.textbookId, latestVersion: data.version.version },
      });
    } catch {
      console.error("ERROR: create book failed");
    }
  };

  const handleCreateNewVersion = async (textbookId, fromVersion) => {
    try {
      const { data } = await api.post(`/textbooks/${textbookId}/versions`, {
        from_version: fromVersion,
      });
      navigate("/teacher/book", {
        state: { textbookId, latestVersion: data.version },
      });
    } catch {
      console.error("ERROR: create new version failed");
    }
  };

  const [isStartModalOpen, setIsStartModalOpen] = useState(false);

  const handleClickStartButton = () => {
    setIsStartModalOpen(true);
  };

  const handleConfirmStartClass = () => {
    setIsStartModalOpen(false);
    navigate("/teacher/lecture");
  };

  return (
    <main className="flex min-h-dvh bg-[#F6F7F8]">
      {/* 사이드바 */}
      <TeacherSidebar />

      {/* 오른쪽 */}
      <div className="flex-1">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          {/* 헤더 */}
          <header className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-[28px] sm:text-[30px] font-black tracking-[-0.5px] text-slate-900">
                안녕하세요, <span className="text-[#13A4EC]">교사님</span> 👋
              </h1>
              <p className="text-sm sm:text-[15px] text-slate-600">
                오늘은 {todayStr}입니다. 수업 준비를 시작해볼까요?
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                className="h-10 sm:h-11 px-4 rounded-xl bg-[#13A4EC] text-white shadow-sm text-sm sm:text-[15px] font-semibold"
                onClick={handleClickStartButton}
              >
                수업 시작
              </button>
              <button
                className="h-10 sm:h-11 px-4 rounded-xl border border-slate-200 bg-white shadow-sm text-sm sm:text-[15px] font-semibold text-slate-900"
                onClick={handleCreateBook}
              >
                새 교재
              </button>
              <button
                className="h-10 sm:h-11 px-4 rounded-xl border border-slate-200 bg-white shadow-sm text-sm sm:text-[15px] font-semibold text-slate-900"
                onClick={() => navigate("/teacher/quiz")}
              >
                새 퀴즈
              </button>
            </div>
          </header>

          {/* 내 교재 */}
          <section className="mt-5 rounded-2xl bg-white border border-slate-200 shadow-sm p-4 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-[18px] font-bold text-slate-900">내 교재</h2>
              <div className="flex items-center gap-2">
                <input
                  className="h-10 w-48 sm:w-60 rounded-lg border border-slate-300 px-3 text-sm placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="교재 검색"
                />
                <select
                  value={filters.bookSort}
                  onChange={(e) => setFilters((f) => ({ ...f, bookSort: e.target.value }))}
                  className="h-10 w-36 rounded-lg border border-slate-300 px-3 text-sm"
                >
                  <option>최근 수정순</option>
                  <option>이름순</option>
                  <option>생성일순</option>
                </select>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {books.map((b) => (
                <article
                  key={b.id}
                  className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden"
                >
                  {/* 썸네일 */}
                  <div className="aspect-[4/3] bg-slate-100">
                    {b.img ? (
                      <img src={b.img} alt={b.title} className="w-full h-full object-cover" />
                    ) : null}
                  </div>
                  {/* 본문 */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-[16px] text-slate-900 line-clamp-1">
                        {b.title}
                      </h3>
                    </div>
                    <p className="mt-1 text-[12px] text-slate-500">마지막 수정: {b.updatedAt}</p>
                    <div className="mt-3">
                      <button
                        className="w-full h-10 rounded-xl border border-slate-200 bg-white shadow-sm text-[14px] font-semibold text-slate-900"
                        onClick={() => handleCreateNewVersion(b.id, b.latestVersion)}
                      >
                        편집
                      </button>
                    </div>
                  </div>
                </article>
              ))}

              <article className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 shadow-inner min-h-[220px] flex items-center justify-center">
                <button
                  className="h-10 px-4 rounded-xl border border-slate-300 bg-white shadow-sm text-sm font-semibold"
                  onClick={() => navigate("/teacher/book")}
                >
                  + 교재 추가
                </button>
              </article>
            </div>
          </section>

          {/* 퀴즈 관리 / 수업 바로 시작 */}
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 퀴즈 관리 */}
            <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-[16px] sm:text-[18px] font-bold text-slate-900">퀴즈 관리</h2>
                <button
                  className="h-9 px-3 rounded-lg border border-slate-200 bg-white shadow-sm text-sm font-semibold"
                  onClick={() => navigate("/teacher/quiz")}
                >
                  + 새 퀴즈
                </button>
              </div>

              <div className="mt-3 overflow-x-auto">
                <table className="min-w-[560px] w-full text-left">
                  <thead className="text-[13px] text-slate-500">
                    <tr>
                      <th className="py-2 pr-3 font-bold">퀴즈</th>
                      <th className="py-2 pr-3 font-bold">교재</th>
                      <th className="py-2 pr-3 font-bold">상태</th>
                      <th className="py-2 pr-3 font-bold">응시</th>
                      <th className="py-2 pr-3 font-bold">평균</th>
                      <th className="py-2 pr-3 font-bold">액션</th>
                    </tr>
                  </thead>
                  <tbody className="text-[14px]">
                    {quizzes.map((q) => (
                      <tr key={q.id} className="border-t border-slate-100">
                        <td className="py-2 pr-3 text-slate-900">{q.title}</td>
                        <td className="py-2 pr-3 text-slate-900">{q.과목}</td>
                        <td className="py-2 pr-3">
                          <StatusPill status={q.상태} />
                        </td>
                        <td className="py-2 pr-3 text-slate-900">{q.응시}</td>
                        <td className="py-2 pr-3 font-semibold text-slate-900">{q.평균}%</td>
                        <td className="py-2 pr-3">
                          <div className="flex items-center gap-2 text-[#13A4EC]">
                            <button className="text-[14px]">결과</button>
                            <span className="text-slate-300">|</span>
                            <button className="text-[14px]">설정</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 수업 바로 시작 */}
            <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-[16px] sm:text-[18px] font-bold text-slate-900">
                  수업 바로 시작
                </h2>
                <button
                  className="h-9 px-3 rounded-lg bg-[#13A4EC] text-white shadow-sm text-sm font-semibold"
                  onClick={handleClickStartButton}
                >
                  시작
                </button>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <LabeledSelect
                  label="교재 선택"
                  value={filters.quickBook}
                  onChange={(v) => setFilters((f) => ({ ...f, quickBook: v }))}
                  options={[""]}
                />
                <LabeledSelect
                  label="단원/페이지"
                  value={filters.unit}
                  onChange={(v) => setFilters((f) => ({ ...f, unit: v }))}
                  options={[""]}
                />
                <LabeledSelect
                  label="수업 모드"
                  value={filters.mode}
                  onChange={(v) => setFilters((f) => ({ ...f, mode: v }))}
                  options={[""]}
                />
              </div>
            </section>
          </div>

          {/* 학생 관리 */}
          <section className="mt-5 rounded-2xl bg-white border border-slate-200 shadow-sm p-4 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-[16px] sm:text-[18px] font-bold text-slate-900">학생 관리</h2>
              <div className="flex items-center gap-2">
                <input
                  value={filters.studentQuery}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      studentQuery: e.target.value,
                    }))
                  }
                  className="h-10 w-56 rounded-lg border border-slate-300 px-3 text-sm placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="이름/이메일 검색"
                />
                <button
                  className="h-10 px-3 rounded-lg border border-slate-200 bg-white shadow-sm text-sm font-semibold"
                  onClick={() => navigate("/teacher/student")}
                >
                  전체 보기
                </button>
              </div>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="min-w-[720px] w-full text-left">
                <thead className="text-[13px] text-slate-500">
                  <tr>
                    <th className="py-2 pr-3 font-bold">학생</th>
                    <th className="py-2 pr-3 font-bold">이메일</th>
                    <th className="py-2 pr-3 font-bold">최근 수업</th>
                    <th className="py-2 pr-3 font-bold">평균 점수</th>
                    <th className="py-2 pr-3 font-bold">상태</th>
                  </tr>
                </thead>
                <tbody className="text-[14px]">
                  {students.map((s) => (
                    <tr key={s.id} className="border-t border-slate-100">
                      <td className="py-2 pr-3 text-slate-900">{s.name}</td>
                      <td className="py-2 pr-3 text-slate-900">{s.email}</td>
                      <td className="py-2 pr-3 text-slate-900">{s.recent}</td>
                      <td className="py-2 pr-3 font-semibold text-slate-900">{s.평균}%</td>
                      <td className="py-2 pr-3">
                        <StudentState state={s.상태} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 푸터 */}
          <footer className="py-6 text-center text-[12px] text-slate-500">
            © 2025 EduNote
          </footer>
        </div>

        {/* 수업 시작 모달 */}
        <StartClassModal
          open={isStartModalOpen}
          onClose={() => setIsStartModalOpen(false)}
          onConfirm={handleConfirmStartClass}
        />
      </div>
    </main>
  );
}

/* 컴포넌트에 추가할 것 */
const today = new Date();
const todayStr = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long",
}).format(today);

function StatusPill({ status }) {
  if (status === "진행중")
    return (
      <span className="inline-flex h-6 items-center rounded-full bg-blue-100 px-2 text-[12px] text-blue-600">
        진행중
      </span>
    );
  if (status === "종료")
    return (
      <span className="inline-flex h-6 items-center rounded-full bg-slate-200 px-2 text-[12px] text-slate-700">
        종료
      </span>
    );
  return (
    <span className="inline-flex h-6 items-center rounded-full bg-slate-100 px-2 text-[12px] text-slate-600">
      {status}
    </span>
  );
}

function StudentState({ state }) {
  const map = {
    활성: "bg-emerald-100 text-emerald-600",
    주의: "bg-amber-100 text-amber-600",
    우수: "bg-slate-200 text-slate-700",
  };
  return (
    <span
      className={`inline-flex h-6 items-center rounded-full px-2 text-[12px] ${
        map[state] || "bg-slate-100 text-slate-600"
      }`}
    >
      {state}
    </span>
  );
}

function LabeledSelect({ label, options = [], value, onChange }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[13px] text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
