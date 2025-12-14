import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TextbookSelectModal from "../components/teacher/TextbookSelectModal";
import ic_logo from "../assets/icons/ic_logo.svg";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://team10-api.kwweb.org";

export default function TeacherLecture() {
  const navigate = useNavigate();
  const [isTextbookModalOpen, setIsTextbookModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  // 내 교재 목록 + 상태 메시지
  const [myTextbooks, setMyTextbooks] = useState([]);
  const [textbookStatus, setTextbookStatus] = useState("");

  useEffect(() => {
    async function fetchMyTextbooks() {
      try {
        if (!BASE_URL) {
          setTextbookStatus("VITE_API_BASE_URL이 설정되지 않았습니다.");
          return;
        }

        const token = localStorage.getItem("access_token");
        if (!token) {
          setTextbookStatus(
            "로그인 정보(access_token)가 없어 교재 목록을 불러올 수 없습니다."
          );
          return;
        }

        const res = await fetch(`${BASE_URL}/textbooks/mine`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("[TeacherLecture] /textbooks/mine status:", res.status);

        if (!res.ok) {
          setTextbookStatus(`교재 목록 불러오기 실패 (status: ${res.status})`);
          return;
        }

        const raw = await res.json();
        console.log("[TeacherLecture] /textbooks/mine raw:", raw);

        // 배열 / { data: [...] } 모두 대응
        const list = Array.isArray(raw) ? raw : raw?.data ?? [];

        // 모달에서 사용하기 편하게 필드 정리
        const normalized = list.map((t) => ({
          ...t,
          // 모달에서 공통으로 쓰는 키들
          id: t.textbook_id ?? t.id,
          subject: t.subject ?? "과목 미지정",
          meta: t.created_at
            ? new Date(t.created_at).toLocaleDateString("ko-KR") + " 생성"
            : "",
        }));

        console.log("[TeacherLecture] normalized textbooks:", normalized);

        setMyTextbooks(normalized);

        if (!normalized.length) {
          setTextbookStatus(
            "생성된 교재가 없습니다. 먼저 교재를 하나 이상 생성해 주세요."
          );
        } else {
          setTextbookStatus(`내 교재 ${normalized.length}개 로딩 완료`);
        }
      } catch (err) {
        console.error("[TeacherLecture] 교재 목록 불러오기 오류:", err);
        setTextbookStatus("교재 목록 불러오기 중 오류가 발생했습니다.");
      }
    }

    fetchMyTextbooks();
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F7F8] flex flex-col">
      {/* 헤더 */}
      <header className="h-[65px] bg-white border-b border-slate-200">
        <div className="mx-auto max-w-[1746px] h-full px-6 flex items-center justify-between">
          {/* 왼쪽: 로고 + 상태 */}
          <div className="flex items-center gap-4">
            <img src={ic_logo} alt="EduNote" className="w-9 h-9 shrink-0" />
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 truncate">
              EduNote · 강의 시작
            </h1>

            {/* 실시간 연결 준비 */}
            <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
              <div className="w-4 h-4 rounded-full bg-[#EF4444]" />
              <span className="text-[14px] font-medium text-slate-500">
                실시간 연결 준비
              </span>
            </div>
          </div>

          {/*  대시보드 버튼 + 프로필 동그라미 */}
          <div className="flex items-center gap-3">
            <button
              className="h-10 px-4 rounded-lg border border-slate-300 bg-white text-[14px] text-slate-900"
              onClick={() => navigate("/teacher")}
            >
              대시보드
            </button>
            <div className="w-10 h-10 rounded-full bg-slate-200" />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center py-10">
        <div className="max-w-[1536px] w-full px-6 flex flex-col lg:flex-row gap-6">
          {/* 수업 준비 영역 */}
          <section className="flex-1 bg-white rounded-lg shadow-sm p-8 flex flex-col gap-4">
            <div>
              <h2 className="text-[20px] font-bold text-slate-900">
                수업 준비 중
              </h2>
              <p className="mt-1 text-[14px] text-slate-600">
                화상통화 연결이 완료되었습니다. 수업에 사용할 교재를 선택해주세요.
              </p>
            </div>

            {/* 교재 상태 메시지 */}
            {textbookStatus && (
              <p className="mt-2 text-[12px] text-slate-500">
                {textbookStatus}
              </p>
            )}

            {/* 선택된 교재 없음 박스 */}
            <div className="mt-4 border border-dashed border-slate-300 rounded-xl px-10 py-12 flex flex-col items-center gap-6">
              <div className="flex flex-col items-center gap-4">
                <p className="max-w-[335px] text-center text-[16px] leading-6 text-slate-600">
                  현재 선택된 교재가 없습니다. 아래 버튼을 눌러 수업에 사용할
                  교재를 선택하세요.
                </p>
              </div>

              {/* 교재 선택하기 버튼 */}
              <button
                type="button"
                onClick={() => setIsTextbookModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 h-11 rounded-lg bg-[#13A4EC] text-white text-[16px] font-bold shadow-sm"
              >
                <span className="text-lg font-bold leading-none text-white">
                  +
                </span>
                <span>교재 선택하기</span>
              </button>
            </div>

            {/* 선택된 교재 표시 */}
            <div className="mt-4 text-[12px] text-slate-500">
              선택된 교재:{" "}
              <span className="font-medium">
                {selectedBook
                  ? selectedBook.textbookTitle || selectedBook.title
                  : "없음"}
              </span>
            </div>
          </section>

          {/* 화상 통화 영역 */}
          <aside className="w-full lg:w-[480px] bg-white rounded-lg shadow-sm p-6 flex flex-col gap-4">
            <h3 className="text-[18px] font-bold text-slate-900">화상 통화</h3>

            <div className="flex flex-col gap-4 flex-1">
              {/* 선생님 화면 */}
              <div className="relative w-full h-[243px] rounded-lg bg-slate-900">
                <div className="absolute left-2 bottom-2 px-2 py-0.5 rounded bg-black/60">
                  <span className="text-[12px] text-white">선생님</span>
                </div>
              </div>

              {/* 나 화면 */}
              <div className="relative w-full h-[243px] rounded-lg bg-slate-800">
                <div className="absolute left-2 bottom-2 px-2 py-0.5 rounded bg-black/60">
                  <span className="text-[12px] text-white">나</span>
                </div>
              </div>

              {/* 하단 컨트롤 버튼들 */}
              <div className="mt-2 flex items-center justify-center gap-3">
                <button className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center">
                  <span className="w-6 h-7 bg-slate-800 rounded" />
                </button>
                <button className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center">
                  <span className="w-6 h-7 bg-slate-800 rounded" />
                </button>
                <button className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
                  <span className="w-6 h-7 bg-white rounded" />
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* 교재 선택 모달 */}
      <TextbookSelectModal
        open={isTextbookModalOpen}
        onClose={() => setIsTextbookModalOpen(false)}
        textbooks={myTextbooks}
        onConfirm={(payload) => {
          setSelectedBook(payload);
          setIsTextbookModalOpen(false);
        }}
      />
    </div>
  );
}
