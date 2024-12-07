import { getUniqueVisitors } from "@/services/statistics/fetchUniqueVisitors";
import { getTimeSpent } from "@/services/statistics/fetchTimeSpent";
import { StatisticsCard } from "@/components/common/statistics/StatisticsCard";
import { StatisticsPieChart } from "@/components/common/statistics/StatisticsPieChart";

export const TimeSpentCard = async ({ boardId }: { boardId: string }) => {
  const [uniqueVisitors, timeSpentData] = await Promise.all([getUniqueVisitors(boardId), getTimeSpent(boardId)]);

  return (
    <StatisticsCard
      title="Aggregated Spent Time"
      description="Sum of time spent by each of the users"
      Chart={
        <StatisticsPieChart
          data={timeSpentData}
          nameKey="email"
          valueKey="timeSpent"
          height="500px"
          innerRadius={100}
          innerValues={{
            label: "Have worked on this board",
            value: uniqueVisitors + " users",
          }}
        />
      }
    />
  );
};
