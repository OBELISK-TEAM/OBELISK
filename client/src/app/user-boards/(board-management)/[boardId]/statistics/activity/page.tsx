import { SectionHeader } from "@/components/common/headers/section-header/SectionHeader";
import React from "react";
import { DatePickerWithRange } from "@/components/common/date-picker/DatePicker";
import { getActiveUsers } from "@/services/statistics/fetchBoardActiveUsersStats";
import { DateRange } from "@/interfaces/date-range";
import { parseDateRange } from "@/lib/dateUtils";
import { ActiveUsersResponse } from "@/interfaces/responses/statistics/active-users-response";
import { ActiveUsersChart } from "@/components/common/charts/ActiveUsersChart";
const ActivityPage = async ({
  searchParams,
  params,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
  params: {
    boardId: string;
  };
}) => {
  const { startDate, endDate }: DateRange = parseDateRange(searchParams, "active-users");
  const activeUsersData: ActiveUsersResponse[] = await getActiveUsers({
    boardId: params.boardId,
    startDate,
    endDate,
    aggregationIntervalMinutes: 60,
  });
  return (
    <section className="rounded-lg border border-border bg-card p-4 shadow">
      <header className="flex items-center justify-between gap-6 p-2">
        <SectionHeader
          title="Active users over time"
          description="Number of active users tracked across a specified time period"
        />
        <DatePickerWithRange prefix={"active-users"} />
      </header>
      <div className="mt-4">
        <ActiveUsersChart data={activeUsersData} />
      </div>
    </section>
  );
};
export default ActivityPage;
