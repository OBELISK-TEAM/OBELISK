"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaginationDemo } from "./PaginationDemo";

const boards = [
  {
    name: "Board 1",
    owner: "You",
    size: "350 kB",
    modifiedAt: "2023-07-15 10:42 AM",
    createdAt: "2023-07-12 10:42 AM",
  },
  {
    name: "Board 2",
    owner: "You",
    size: "21 kB",
    modifiedAt: "2023-10-19 08:21 PM",
    createdAt: "2023-10-18 03:21 PM",
  },
  {
    name: "Board 3",
    owner: "John Doe",
    size: "1.2 MB",
    modifiedAt: "2023-11-29 08:15 AM",
    createdAt: "2023-11-29 08:15 AM",
  },
  {
    name: "Board 4",
    owner: "You",
    size: "449 kB",
    modifiedAt: "2023-12-25 11:59 PM",
    createdAt: "2023-12-25 11:59 PM",
  },
  {
    name: "Board 5",
    owner: "Amelia",
    size: "221 kB",
    modifiedAt: "2024-01-01 12:00 AM",
    createdAt: "2024-01-01 12:00 AM",
  },
  {
    name: "Board 6",
    owner: "You",
    size: "2.6 MB",
    modifiedAt: "2024-02-14 02:14 PM",
    createdAt: "2024-02-14 02:14 PM",
  },
];

const BoardTable = () => {
  return (
    <div className="rounded-lg border bg-card p-4">
      <h1 className="font-bold text-card-foreground" style={{ fontSize: "20px" }}>
        Boards
      </h1>
      <span className="text-muted-foreground" style={{ fontSize: "15px" }}>
        Manage your boards
      </span>
      <Table className="w-full">
        <TableHeader className="text-muted-foreground">
          <TableRow className="border-b">
            <TableHead className="py-2 text-left"></TableHead>
            <TableHead className="py-2 text-left">Name</TableHead>
            <TableHead className="py-2 text-left">Owner</TableHead>
            <TableHead className="py-2 text-left">Size</TableHead>
            <TableHead className="py-2 text-left">Modified at</TableHead>
            <TableHead className="py-2 text-left">Created at</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {boards.map((board) => (
            <TableRow key={board.name} className="border-b text-card-foreground hover:bg-muted/50">
              <TableCell className="py-2">
                <div className="h-8 w-8 rounded bg-gray-200"></div>
              </TableCell>
              <TableCell className="py-2">{board.name}</TableCell>
              <TableCell className="py-2">{board.owner}</TableCell>
              <TableCell className="py-2">{board.size}</TableCell>
              <TableCell className="py-2">{board.modifiedAt}</TableCell>
              <TableCell className="py-2">{board.createdAt}</TableCell>
              <TableCell className="py-2 text-right">
                <button className="hover:text-muted-foreground">...</button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex items-center justify-between">
        <span className="w-[18em] grow text-muted-foreground" style={{ fontSize: "15px" }}>
          Showing 1-10 of 32 products
        </span>
        <PaginationDemo />
      </div>
    </div>
  );
};

export default BoardTable;
