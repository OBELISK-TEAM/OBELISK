import { SummaryCard } from "@/components/common/statistics/SummaryCard";

export const UniqueVisitors = ({ uniqueVisitors }: { uniqueVisitors: number }) => {
  return <SummaryCard value={uniqueVisitors + " users"} description={"have worked on this board"} />;
};
