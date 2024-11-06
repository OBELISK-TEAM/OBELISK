import "./hexagon.css";
import HexagonItem from "@/components/start/Hexagon";

const HexagonLayout = () => {
  return (
    <div className="hexagon-container">
      <HexagonItem text="Brainstorming" />
      <HexagonItem text="Digital collaboration" />
      <HexagonItem text="Prototyping and diagram sketching" />
      <HexagonItem text="Simple work organization" />
      <HexagonItem text="Remote education and tutoring" />
      <HexagonItem text="Work contribution evaluation" />
    </div>
  );
};

export default HexagonLayout;
