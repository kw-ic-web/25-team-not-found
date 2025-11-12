import RoundedBlock from "../../components/RoundedBlock";
import ic_document from "../../assets/icons/student/enter-class/ic_document.svg";
import ic_download from "../../assets/icons/student/enter-class/ic_download.svg";

const EnterClass = () => {
  return (
    <main className="flex flex-col items-center pt-[48px] w-full min-h-screen bg-[#F6F7F8]">
      <h1 className="text-[48px] font-extrabold text-[#111827]">수업 참여</h1>

      <RoundedBlock className="mt-[40px] p-[32px] w-[832px] h-[596.5px]">
        <section className="flex flex-col gap-[32px] w-full">
          <section className="flex justify-between w-full">
            <div className="flex flex-col gap-[8px]">
              <p className="text-[16px] text-[#13A4EC]">예정된 수업</p>
              <p className="text-[24px] font-bold text-[#111827]">미국 혁명</p>
              <p className="max-w-[496px] text-[16px] text-[#4B5563]">
                독립선언서를 포함하여 미국 혁명의 원인·주요 사건·결과를
                살펴보고, 미국 건국의 과정을 이해합니다.
              </p>
            </div>
            <div className="w-[248px] h-[139.5px] rounded-[8px] bg-gray-200"></div>
          </section>

          <section className="flex justify-between w-full">
            <div className="flex gap-[16px] p-[16px] w-[372px] h-[80px] bg-[#F6F7F8]">
              <div className="size-[48px] bg-gray-200 bg-cover bg-center rounded-full"></div>
              <div>
                <p className="text-[14px] text-[#6B7280]">교사</p>
                <p className="text-[16px] font-semibold text-[#1F2937]">
                  Emily Carter
                </p>
              </div>
            </div>

            <div className="flex gap-[16px] p-[16px] w-[372px] h-[80px] bg-[#F6F7F8]">
              <div className="size-[48px] bg-gray-200 bg-cover bg-center rounded-full"></div>
              <div>
                <p className="text-[14px] text-[#6B7280]">연결 상태</p>
                <p className="text-[16px] font-semibold text-[#1F2937]">
                  교사 연결 대기 중
                </p>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-[8px] w-full">
            <p className="text-[18px] font-semibold text-[#111827]">
              수업 전 자료
            </p>
            <p className="text-[16px] text-[#4B5563]">
              수업 시작 전 첨부 문서를 미리 확인하세요. 오늘 다룰 핵심 용어와
              개념이 정리되어 있습니다.
            </p>
            <div className="flex justify-between items-center pt-[16px] pb-[12px] px-[12px] w-full h-[68px] rounded-[8px] bg-[#F6F7F8]">
              <div className="flex items-center gap-[16px]">
                <div className="flex justify-center items-center size-[40px] bg-white">
                  <img src={ic_document} alt="" />
                </div>
                <p className="text-[16px] text-[#1F2937]">
                  혁명 전쟁 핵심 용어.pdf
                </p>
              </div>
              <button className="cursor-pointer">
                <img src={ic_download} alt="" />
              </button>
            </div>
          </section>

          <div className="flex justify-center mt-[25px] w-full">
            <button className="w-[159px] h-[48px] bg-[#13A4EC] rounded-[12px] text-[16px] text-white font-bold cursor-pointer">
              수업 참여
            </button>
          </div>
        </section>
      </RoundedBlock>
    </main>
  );
};

export default EnterClass;
