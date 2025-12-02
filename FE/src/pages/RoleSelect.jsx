import RoleSelectBtn from "../components/role_select/RoleSelectBtn";
import ic_grad_hat from "../assets/icons/role_select/ic_grad_hat.svg";
import ic_human from "../assets/icons/role_select/ic_human.svg";
import { useNavigate } from "react-router-dom";

const RoleSelect = () => {
  const navigate = useNavigate();
  return (
    <main className="flex flex-col justify-center items-center gap-[48px] w-full h-screen bg-[#F6F7F8]">
      <section className="flex flex-col gap-[16px]">
        <h1 className="text-[36px] font-extrabold text-[#0F172A] text-center">
          당신의 역할을 선택하세요
        </h1>
        <p className="text-[18px] text-[#64748B] text-center">
          더 나은 학습경험을 위해, 나에게 맞는 역할을 선택해보세요.
        </p>
      </section>

      <section className="flex gap-[32px]">
        <RoleSelectBtn
          src={ic_grad_hat}
          title="교사"
          content="과정을 만들고 자료를 관리하며, 학생의 학습과 성장을 이끕니다."
          onClick={() => {
            navigate("/teacher");
          }}
        />
        <RoleSelectBtn
          src={ic_human}
          title="학생"
          content="수업 자료에 접근하고 과제를 수행하며, 교사와 협업합니다."
          onClick={() => {
            navigate("/student");
          }}
        />
      </section>
    </main>
  );
};

export default RoleSelect;
