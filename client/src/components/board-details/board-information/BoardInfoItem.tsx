import React from "react";
import { Label } from "@/components/ui/label";

interface BoardInfoItemProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}

const BoardInfoItem: React.FC<BoardInfoItemProps> = ({ icon, label, children }) => (
  <div className="mb-4 flex flex-col gap-1">
    <div className="flex items-center">
      {icon}
      <Label className="ml-1 text-sm font-semibold">{label}</Label>
    </div>
    <div className="mt-2 flex items-center">{children}</div>
  </div>
);

export default BoardInfoItem;
