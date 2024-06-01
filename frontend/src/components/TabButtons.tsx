'use client';
import React, { useState } from "react";


interface TabButtonProps {
  tabs: { label: string }[];
}
const TabButtons: React.FC<TabButtonProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.label || "");

  const tabClasses = "px-4 py-2 text-sm text-gray-600 rounded-md hover:bg-white hover:text-gray-900";
  const activeTabClasses = "px-4 py-2 text-sm bg-white text-gray-900 font-semibold rounded-md shadow-sm";

  return (
    <div className="flex space-x-2 bg-gray-100 p-2 rounded-lg">
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
