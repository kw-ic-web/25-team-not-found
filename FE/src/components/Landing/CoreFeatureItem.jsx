import RoundedBlock from "../RoundedBlock";

const CoreFeatureItem = ({ src, title, content }) => {
  return (
    <RoundedBlock className="p-[25px] w-[469.33px] h-[198px]">
      <section className="flex flex-col gap-[16px]">
        <div className="flex justify-center items-center size-[48px] bg-[#13A4EC]/10 rounded-[8px]">
          <img className="size-[28px]" src={src} alt="" />
        </div>
        <h3 className="text-[18px] font-bold text-[#111827]">{title}</h3>
        <p className="text-[14px] text-[#4B5563]">{content}</p>
      </section>
    </RoundedBlock>
  );
};

export default CoreFeatureItem;
