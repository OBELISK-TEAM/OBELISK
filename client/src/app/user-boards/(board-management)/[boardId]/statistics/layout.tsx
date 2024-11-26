import React from "react";
import StatisticsTabs from "@/app/user-boards/(board-management)/[boardId]/statistics/_components/StatisticsTab";
const StatisticsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <StatisticsTabs />
      <div className="mt-4">{children}</div>
    </div>
  );
};

export default StatisticsLayout;
