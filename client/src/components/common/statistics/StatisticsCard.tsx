import React from "react";
import { SectionHeader } from "@/components/common/headers/section-header/SectionHeader";
import { DateRangePicker } from "@/components/common/date-picker/DateRangePicker";
import { Card } from "@/components/ui/card";
import { StatisticsCardProps } from "@/interfaces/stats/statistics-card";
import { cn } from "@/lib/utils";

export const StatisticsCard = <T,>({
  title,
  description,
  datePickerPrefix,
  Chart,
  children,
  className,
}: StatisticsCardProps<T>) => (
  <Card className={cn("rounded-lg border border-border bg-card p-4 shadow", className)}>
    <header className="flex items-center justify-between gap-6 p-2">
      <SectionHeader title={title} description={description} />
    </header>
    {Chart && <main className="my-2">{Chart}</main>}
    {datePickerPrefix && <DateRangePicker prefix={datePickerPrefix} />}
    <div>{children}</div>
  </Card>
);
