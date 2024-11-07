"use client";
import React from "react";
import Hexagon from "./Hexagon";

const HexagonLayout: React.FC = () => {
  return (
    <div className="flex w-full flex-wrap items-center justify-around md:w-[780px]">
      <Hexagon
        text="Brainstorming"
        hoverText="Generate and explore ideas collectively in a dynamic, visual workspace."
      />
      <Hexagon
        text="Digital collaboration"
        hoverText="Organize tasks and resources in a straightforward way to streamline productivity."
      />
      <Hexagon
        text="Prototyping and diagram sketching"
        hoverText="Conduct engaging and interactive learning sessions from anywhere."
      />
      <Hexagon
        text="Simple work organization"
        hoverText="Work together seamlessly on shared projects with interactive digital tools."
      />
      <Hexagon
        text="Remote education and tutoring"
        hoverText="Quickly create, test, and refine ideas through sketches and simple prototypes."
        className="relative md:top-[-20px]"
      />
      <Hexagon
        text="Work contribution evaluation"
        hoverText="Assess individual contributions and track progress on team projects."
        className="relative md:top-[-20px]"
      />
    </div>
  );
};

export default HexagonLayout;
