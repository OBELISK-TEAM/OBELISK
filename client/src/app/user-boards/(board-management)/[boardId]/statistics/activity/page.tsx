import React from "react";
import { getActiveUsers } from "@/services/statistics/fetchBoardActiveUsersStats";
import { DateRange } from "@/interfaces/date-range";
import { parseDateRange } from "@/lib/dateUtils";
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
  const { startDate, endDate }: DateRange = parseDateRange(searchParams, statsConfig.activeUsers);
  const activeUsersData = await getActiveUsers({
    boardId: params.boardId,
    startDate,
    endDate,
    aggregationIntervalMinutes: 1440, // One day in minutes
  });

  return <ActiveUsersCard data={activeUsersData}></ActiveUsersCard>;
};
export default ActivityPage;
