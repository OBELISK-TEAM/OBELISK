"use client";
import { FC } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCreateBoard } from "@/contexts/CreateBoardContext";
import { CreateBoardDialog } from "@/components/user-boards/CreateBoardDialog";

const HeaderLinks: FC = () => {
  const { isLoading, createNewBoard } = useCreateBoard();

  const QuickBoardButton = (
    <CreateBoardDialog action={createNewBoard}>
      <Link key="new-board" href={"#"}>
        <Button variant="mild" disabled={isLoading}>
          {isLoading ? "Creating..." : "Quick board"}
        </Button>
      </Link>
    </CreateBoardDialog>
  );

  const DashboardButton = (
    <Link key="dashboard" href={"/user-boards"}>
      <Button variant="mild">Dashboard</Button>
    </Link>
  );
  return (
    <div className="mx-5 flex items-center space-x-4">
      {DashboardButton}
      {QuickBoardButton}
    </div>
  );
};

export default HeaderLinks;
