"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  StatisticsActiveTab,
  StatisticsActiveTabMap,
  statisticsActiveTabConverter,
} from "@/enums/active-tab/StatisticsActiveTab";
import TabButtons from "@/components/common/tab-buttons/TabButtons";

const tabs = [
  { label: "Activity", value: StatisticsActiveTab.ACTIVITY },
  { label: "Time spent", value: StatisticsActiveTab.TIME_SPENT },
  { label: "Permissions management", value: StatisticsActiveTab.PERMISSIONS_MANAGEMENT },
];
const StatisticsTabs: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const pathSegments = pathname.split("/").filter(Boolean);
  const currentTabSegment = pathSegments[pathSegments.length - 1];
  const activeTab = statisticsActiveTabConverter(currentTabSegment) || StatisticsActiveTab.ACTIVITY;

  const handleTabChange = (tab: StatisticsActiveTab) => {
    const tabPath = StatisticsActiveTabMap[tab];
    const boardId = pathSegments[pathSegments.length - 3];
    router.push(`/user-boards/${boardId}/statistics/${tabPath}`);
  };
  useEffect(() => {
    if (!StatisticsActiveTabMap[activeTab]) {
      const boardId = pathSegments[pathSegments.length - 3];
      router.replace(`/user-boards/${boardId}/statistics/${StatisticsActiveTabMap[StatisticsActiveTab.ACTIVITY]}`);
    }
  }, [activeTab, pathSegments, router]);

  return (
    <div className={"flex w-full"}>
      <TabButtons tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default StatisticsTabs;
