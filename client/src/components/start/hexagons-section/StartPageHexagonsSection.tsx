"use client";
import React from "react";
import StartPageHexagon from "./StartPageHexagon";
import { IStartPageHexagonsSection } from "@/interfaces/start-page/hexagons-section";
interface HexagonsSectionProps {
  hexagonsSection: IStartPageHexagonsSection[];
}
const StartPageHexagonsSection = ({ hexagonsSection }: HexagonsSectionProps) => {
  return (
    <div className="flex w-full flex-wrap items-center justify-around md:w-[780px]">
      {hexagonsSection.map((data, index) => (
        <StartPageHexagon key={index} text={data.text} hoverText={data.hoverText} className={data.className} />
      ))}
    </div>
  );
};

export default StartPageHexagonsSection;
