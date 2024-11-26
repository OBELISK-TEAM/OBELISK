import React from "react";
import { Card, CardDescription } from "@/components/ui/card";
import { Users2 } from "lucide-react";

interface UniqueVisitorsCardProps {
  count: number;
}

export const UniqueVisitors: React.FC<UniqueVisitorsCardProps> = ({ count }) => (
  <Card className="animate-fadeIn flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white shadow-lg sm:flex-row">
    <Users2 className="mr-4 h-8 w-8" />
    <CardDescription className="text-center text-lg">
      This board was visited by <span className="text-3xl font-bold">{count}</span> unique people!
    </CardDescription>
  </Card>
);
