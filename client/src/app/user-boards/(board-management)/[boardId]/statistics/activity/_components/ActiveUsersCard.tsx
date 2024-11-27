import React from "react";
import { ActiveUsersResponse } from "@/interfaces/responses/statistics/active-users-response";
import { statsConfig } from "@/config/statsConfig";
import { StatisticsCard } from "@/components/common/statistics/StatisticsCard";
import { StatisticsChart } from "@/components/common/statistics/StatisticsChart";

interface ActiveUsersCardProps {
  data: ActiveUsersResponse[];
}

export const ActiveUsersCard: React.FC<ActiveUsersCardProps> = ({ data }) => (
  <StatisticsCard
    title="Active Users Over Time"
    description="Number of active users tracked across a specified time period"
    datePickerPrefix={statsConfig.activeUsers}
    Chart={
      <StatisticsChart
        data={data}
        axisX={"timestamp"}
        yAxes={[{ labelY: "active users", axisY: "value", colorY: "hsl(var(--chart-1))" }]}
      />
    }
  />
);
