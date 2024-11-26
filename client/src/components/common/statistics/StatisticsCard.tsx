import React from "react";
import { SectionHeader } from "@/components/common/headers/section-header/SectionHeader";
import { DatePickerWithRange } from "@/components/common/date-picker/DateRangePicker";
import { Card } from "@/components/ui/card";
import { StatisticsCardProps } from "@/types/statistics/StatisticsCardProps";

export const StatisticsCard = <T,>({
  title,
  description,
  datePickerPrefix,
  ChartComponent,
  chartData,
  children,
}: StatisticsCardProps<T>) => (
  <Card className="rounded-lg border border-border bg-card p-4 shadow">
    <header className="flex items-center justify-between gap-6 p-2">
      <SectionHeader title={title} description={description} />
      {datePickerPrefix && <DatePickerWithRange prefix={datePickerPrefix} />}
    </header>
    {ChartComponent && chartData && (
      <div className="mt-4">
        <ChartComponent data={chartData} />
      </div>
    )}
    <div>{children}</div>
  </Card>
);
