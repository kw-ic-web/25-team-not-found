import CalenderBlock from "./CalenderBlock";

/**
 * 달력 component
 * @param {Array} list - 달력 데이터, [1, 2, 3, 2, 1, 2, 2, ...], 0: 자리 채우기용
 * @returns {JSX.Element}
 */
const ColoredCalender = ({ list }) => {
  return (
    <div className="grid grid-cols-7 grid-rows-5 gap-x-[20px] gap-y-[4px]">
      {list.map((item, index) => (
        <CalenderBlock key={index} type={item}></CalenderBlock>
      ))}
    </div>
  );
};

export default ColoredCalender;
