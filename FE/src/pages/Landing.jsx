import landing from "../assets/landing.png";
import CoreFeatureItem from "../components/Landing/CoreFeatureItem";
import ic_book from "../assets/icons/landing/ic_book.svg";
import ic_people from "../assets/icons/landing/ic_people.svg";
import ic_pen from "../assets/icons/landing/ic_pen.svg";
import ReviewItem from "../components/Landing/ReviewItem";

const Landing = () => {
  return (
    <main className="bg-[#F6F7F8]">
      <section
        className="flex justify-center items-center w-full h-[720px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${landing})` }}
      >
        <div className="flex flex-col gap-[24px]">
          <h1 className="text-[60px] font-extrabold leading-[60px] text-white text-center">
            1:1 학습을 위한
            <br />
            맞춤형 전자 교과서
          </h1>
          <p className="text-[20px] font-light text-white text-center">
            "함께 만드는 지식, 나만의 학습 경험"
            <br />
            "교사와 학생이 만들어가는 새로운 교육 공간"
            <br />
            "맞춤형 학습을 위한 교사와 학생의 협업 플랫폼"
          </p>
          <div className="flex justify-center w-full">
            <button className="mt-[16px] w-[123px] h-[48px] bg-[#13A4EC] rounded-[8px] text-[16px] font-bold text-white cursor-pointer">
              시작하기
            </button>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center py-[96px]">
        <h2 className="text-[36px] font-bold text-[#111827]">핵심 기능</h2>
        <p className="mt-[16px] mb-[48px] text-[18px] text-[#4B5563]">
          EduNote가 개인화 교육에 적합한 이유가 되는 대표 기능들을 살펴보세요.
        </p>
        <section className="flex gap-[32px]">
          <CoreFeatureItem
            src={ic_book}
            title="인터랙티브 e-교재"
            content={
              <>
                단순히 읽는 것을 넘어, 직접 참여하고 피드백하여
                <br />
                나만의 학습 경험을 완성합니다.
              </>
            }
          />
          <CoreFeatureItem
            src={ic_people}
            title="1:1 학습 환경"
            content={
              <>
                교사와 학생이 밀접하게 상호작용하는 전용 1:1 학습 공간을
                제공합니다.
              </>
            }
          />
          <CoreFeatureItem
            src={ic_pen}
            title="실시간 피드백"
            content={
              <>즉각적인 피드백으로 이해도를 높이고 학습 결과를 개선합니다.</>
            }
          />
        </section>
      </section>

      <section className="flex flex-col items-center py-[96px]">
        <h2 className="text-[36px] font-bold text-[#111827]">사용자 후기</h2>
        <p className="mt-[16px] mb-[48px] text-[18px] text-[#4B5563]">
          EduNote가 만들어낸 변화를 교사와 학생들의 생생한 후기에서 확인하세요
        </p>
        <section className="flex gap-[32px]">
          <ReviewItem
            src=""
            username="Sarah Johnson"
            userType="고등학교 교사"
            content={
              '"EduNote는 제 수업 방식을 완전히 바꿔줬어요. 학생별로 개인화된 e-교재를 만들 수 있어 학생들의 몰입도와 이해도가 크게 높아졌습니다."'
            }
          />
          <ReviewItem
            src=""
            username="Michael Chen"
            userType="고1 학생"
            content={
              '"학생 입장에서 e-교재가 정말 상호작용적이라 재미있어요. 일반 교과서보다 훨씬 몰입되고, 학습 효율도 높아졌다고 느껴요."'
            }
          />
          <ReviewItem
            src=""
            username="David Rodriguez"
            userType="대학교 교수"
            content={
              '"1:1 피드백 기능은 완전히 새로운 전환점이었습니다. 학생들의 질문에 실시간으로 대응하면서 학습 진전을 크게 도울 수 있었죠."'
            }
          />
        </section>
      </section>

      <section className="flex flex-col items-center gap-[16px] py-[96px] w-full h-[396px] bg-white">
        <h2 className="text-[36px] font-bold leading-[40px] text-[#111827] text-center">
          지금 바로, 당신의 학습을
          <br />
          새로운 경험으로 바꿔보세요!
        </h2>
        <p className="text-[18px] text-[#4B5563]">
          오늘부터 EduNote와 함께 나만을 위한 교육을 시작하세요.
        </p>
        <div className="flex justify-center mt-[16px] w-full">
          <button className="w-[142px] h-[48px] bg-[#13A4EC] rounded-[8px] text-[16px] font-bold text-white cursor-pointer">
            자세히 보기
          </button>
        </div>
      </section>

      <section className="flex justify-between items-center px-[11.666666666666666666666666666667%] w-full h-[85px]">
        <div className="flex gap-[24px]">
          <button className="text-[14px] text-[#6B7280] cursor-pointer">
            이용약관
          </button>
          <button className="text-[14px] text-[#6B7280] cursor-pointer">
            개인정보처리방침
          </button>
          <button className="text-[14px] text-[#6B7280] cursor-pointer">
            문의하기
          </button>
        </div>
        <p className="text-[14px] text-[#6B7280]">
          © {new Date().getFullYear()} EduNote. All rights reserved.
        </p>
      </section>
    </main>
  );
};

export default Landing;
