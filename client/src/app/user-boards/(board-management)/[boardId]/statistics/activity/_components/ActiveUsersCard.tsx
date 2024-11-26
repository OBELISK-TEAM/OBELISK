import React from "react";
import { ActiveUsersResponse } from "@/interfaces/responses/statistics/active-users-response";
import { statsConfig } from "@/config/statsConfig";
import { StatisticsCard } from "@/components/common/statistics/StatisticsCard";
import { ActiveUsersChart } from "@/app/user-boards/(board-management)/[boardId]/statistics/activity/_components/ActiveUsersChart";

interface ActiveUsersCardProps {
  data: ActiveUsersResponse[];
}

export const ActiveUsersCard: React.FC<ActiveUsersCardProps> = ({ data }) => (
  <StatisticsCard<ActiveUsersResponse[]>
    title="Active Users Over Time"
    description="Number of active users tracked across a specified time period"
    datePickerPrefix={statsConfig.activeUsers}
    ChartComponent={ActiveUsersChart}
    chartData={data}
  />
);
