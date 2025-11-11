import RoundedBlock from "../RoundedBlock";

const ReviewItem = ({ src, username, userType, content }) => {
  return (
    <RoundedBlock className="p-[25px] w-[469.33px] h-[198px]">
      <div className="flex flex-col justify-between w-full h-full">
        <p className="text-[16px] text-[#4B5563]">{content}</p>
        <div className="flex items-center gap-[16px]">
          <div
            className="size-[48px] rounded-full bg-gray-200 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${src})` }}
          ></div>
          <div>
            <p className="text-[16px] font-bold text-[#111827]">{username}</p>
            <p className="text-[14px] text-[#6B7280]">{userType}</p>
          </div>
        </div>
      </div>
    </RoundedBlock>
  );
};

export default ReviewItem;
