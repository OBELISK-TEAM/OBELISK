import React from "react";
import { getActiveUsers } from "@/services/statistics/fetchBoardActiveUsersStats";
import { DateRange } from "@/interfaces/date-range";
import { determineAggregationRule, fillMissingDates, getParsedDateRangeFromUrl } from "@/lib/dateUtils";
import { statsConfig } from "@/config/statsConfig";
import { ActiveUsersCard } from "@/app/user-boards/(board-management)/[boardId]/statistics/activity/_components/ActiveUsersCard";
const ActivityPage = async ({
  searchParams,
  params,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
  params: {
    boardId: string;
  };
}) => {
  const { startDate, endDate }: DateRange = getParsedDateRangeFromUrl(searchParams, statsConfig.activeUsers);
  const aggregationIntervalRule = determineAggregationRule(startDate, endDate);
  const activeUsersData = await getActiveUsers({
    boardId: params.boardId,
    startDate,
    endDate,
    aggregationIntervalMinutes: aggregationIntervalRule.intervalInMinutes,
  });
  const completedActiveUsersData = fillMissingDates(activeUsersData, aggregationIntervalRule, startDate, endDate);

  return (
    <ActiveUsersCard
      data={completedActiveUsersData}
      aggregationIntervalMinutes={aggregationIntervalRule.intervalInMinutes}
    ></ActiveUsersCard>
  );
};
export default ActivityPage;
