import React from "react";
import { TableRow, TableHead, TableHeader } from "@/components/ui/table";
interface TableHeaderRowProps {
  columns: string[];
}
export const BoardTableLeadRow: React.FC<TableHeaderRowProps> = ({ columns }) => {
  return (
    <TableHeader className="text-muted-foreground">
      <TableRow className="border-b">
        {columns.map((col) => (
          <TableHead key={col} className="left py-2">
            {col}
          </TableHead>
        ))}
        <TableHead className="py-2 text-center">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
