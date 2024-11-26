import { SectionHeader } from "@/components/common/headers/section-header/SectionHeader";
import React from "react";

const ActivityPage = () => {
  return (
    <section className="rounded-lg border border-border bg-card p-4 shadow">
      <header className="flex items-center justify-between gap-6 p-2">
        <SectionHeader
          title="Active users over time"
          description="Number of active users tracked across a specified time period"
        />
      </header>
    </section>
  );
};
export default ActivityPage;
