"use client";
import React from "react";
interface TabButtonProps<T> {
  tabs: { label: string; value: T }[];
  activeTab: T;
  onTabChange: (tab: T) => void;
}

const TabButtons = <T extends string | number>({ tabs, activeTab, onTabChange }: TabButtonProps<T>) => {
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
