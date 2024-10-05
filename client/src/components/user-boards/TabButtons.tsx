"use client";
import React from "react";
import { BoardsActiveTab } from "@/enums/BoardsActiveTab";

interface TabButtonProps {
  tabs: { label: string; value: BoardsActiveTab }[];
  activeTab: BoardsActiveTab;
  onTabChange: (tab: BoardsActiveTab) => void;
}

const TabButtons: React.FC<TabButtonProps> = ({ tabs, activeTab, onTabChange }) => {
  const tabClasses =
    "px-4 py-2 text-sm bg-muted text-muted-foreground rounded-md hover:bg-background hover:text-foreground";
  const activeTabClasses = "px-4 py-2 text-sm bg-background text-foreground font-semibold rounded-md shadow-sm";

  return (
    <div className="flex space-x-2 rounded-lg bg-muted p-2">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={activeTab === tab.value ? activeTabClasses : tabClasses}
          onClick={() => onTabChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabButtons;
