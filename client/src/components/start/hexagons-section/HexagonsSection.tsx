"use client";
import React from "react";
import Hexagon from "./Hexagon";
import { IHexagonsSection } from "@/interfaces/start-page/hexagons-section";
interface HexagonsSectionProps {
  hexagonsSection: IHexagonsSection[];
}
const HexagonsSection = ({ hexagonsSection }: HexagonsSectionProps) => {
  return (
    <div className="flex w-full flex-wrap items-center justify-around md:w-[780px]">
      {hexagonsSection.map((data, index) => (
        <Hexagon key={index} text={data.text} hoverText={data.hoverText} className={data.className} />
      ))}
    </div>
  );
};

export default HexagonsSection;
