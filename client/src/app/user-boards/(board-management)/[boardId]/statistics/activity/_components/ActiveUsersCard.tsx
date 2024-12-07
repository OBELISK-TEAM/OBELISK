import React from "react";
import { ActiveUsersResponse } from "@/interfaces/responses/statistics/active-users-response";
import { statsConfig } from "@/config/statsConfig";
import { StatisticsCard } from "@/components/common/statistics/StatisticsCard";
import { StatisticsTimelineChart } from "@/components/common/statistics/StatisticsTimelineChart";

interface ActiveUsersCardProps {
  data: ActiveUsersResponse[];
  aggregationIntervalMinutes: number;
}

export const ActiveUsersCard: React.FC<ActiveUsersCardProps> = ({ data, aggregationIntervalMinutes }) => (
  <StatisticsCard
    title="Active Users Over Time"
    description="Number of active users tracked across a specified time period"
    datePickerPrefix={statsConfig.activeUsers}
    Chart={
      <StatisticsTimelineChart
        data={data}
        type="monotone"
        axisX={"timestamp"}
        yAxes={[{ labelY: "active users", axisY: "value", colorY: "hsl(var(--chart-1))" }]}
        aggregationInterval={aggregationIntervalMinutes}
      />
    }
  />
);
