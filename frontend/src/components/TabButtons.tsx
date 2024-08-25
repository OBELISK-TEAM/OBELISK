"use client";
import React, { useState } from "react";

interface TabButtonPropsI {
  tabs: { label: string }[];
}
const TabButtons: React.FC<TabButtonPropsI> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.label || "");

  const tabClasses =
    "px-4 py-2 text-sm bg-muted text-muted-foreground rounded-md hover:bg-background hover:text-foreground";
  const activeTabClasses = "px-4 py-2 text-sm bg-background text-foreground font-semibold rounded-md shadow-sm";

  return (
    <div className="flex space-x-2 rounded-lg bg-muted p-2">
      {tabs.map((tab) => (
        <button
          key={tab.label}
          className={activeTab === tab.label ? activeTabClasses : tabClasses}
          onClick={() => setActiveTab(tab.label)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabButtons;
