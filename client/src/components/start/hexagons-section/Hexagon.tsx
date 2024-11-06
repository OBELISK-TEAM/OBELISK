import "./hexagon.css";

const HexagonItem = ({ text }: { text: string }) => {
  return (
    <div className={"wrapper relative"}>
      <p className={"absolute"}>{text}</p>
      <div className="gradient hexagon"></div>
    </div>
  );
};

export default HexagonItem;
