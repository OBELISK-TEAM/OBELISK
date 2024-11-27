import React from "react";
import { SectionHeader } from "@/components/common/headers/section-header/SectionHeader";
import { DateRangePicker } from "@/components/common/date-picker/DateRangePicker";
import { Card } from "@/components/ui/card";
import { StatisticsCardProps } from "@/interfaces/stats/statistics-card";

export const StatisticsCard = <T,>({
  title,
  description,
  datePickerPrefix,
  Chart,
  children,
}: StatisticsCardProps<T>) => (
  <Card className="rounded-lg border border-border bg-card p-4 shadow">
    <header className="flex items-center justify-between gap-6 p-2">
      <SectionHeader title={title} description={description} />
      {datePickerPrefix && <DateRangePicker prefix={datePickerPrefix} />}
    </header>
    {Chart && <div className="mt-4">{Chart}</div>}
    <div>{children}</div>
  </Card>
);
