//import { getUniqueVisitors } from "@/services/statistics/fetchUniqueVisitors";
import { getTimeSpent } from "@/services/statistics/fetchTimeSpent";
import { StatisticsCard } from "@/components/common/statistics/StatisticsCard";
import { StatisticsPieChart } from "@/components/common/statistics/StatisticsPieChart";
//import { SummaryCard } from "@/components/common/statistics/SummaryCard";
import { TimeSpentResponse } from "@/interfaces/responses/statistics/time-spent-response";
import { timeInHoursAndMinutesOrSeconds } from "@/lib/dateUtils";

const aggregateTimeSpent = (timeSpentData: TimeSpentResponse[]): string => {
  const totalTime = timeSpentData.reduce((acc, item) => acc + item.timeSpent, 0); // Aggregate time
  return timeInHoursAndMinutesOrSeconds(totalTime);
};
export const TimeSpentCard = async ({ boardId }: { boardId: string }) => {
  const [
    //  uniqueVisitors,
    timeSpentData,
  ] = await Promise.all([
    //  getUniqueVisitors(boardId),
    getTimeSpent(boardId),
  ]);
  // sort timeSpentData
  timeSpentData.sort((a, b) => b.timeSpent - a.timeSpent);
  const aggregatedTime = aggregateTimeSpent(timeSpentData);
  return (
    <section className="flex h-full w-full flex-wrap gap-4">
      {/* we can insert SummaryCard here in the future*/}
      {/*<div className={"flex flex-col gap-3"}>*/}
      {/*  <SummaryCard value={uniqueVisitors + " users"} description={"have worked on this board"} className={"h-48"} />*/}
      {/*  /!* we can insert more SummaryCard here!/*/}
      {/*</div>*/}
      <StatisticsCard
        title="Aggregated Spent Time"
        description="Sum of time spent by each of the users"
        className={"flex-grow"}
        Chart={
          <StatisticsPieChart
            data={timeSpentData}
            nameKey="email"
            valueKey="timeSpent"
            height="500px"
            innerRadius={100}
            innerValues={{
              label: "Total time spent on the board",
              value: aggregatedTime,
            }}
          />
        }
      />
    </section>
  );
};
