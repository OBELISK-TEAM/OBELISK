"use client";

import React from "react";
import { Calendar as FaCalendarAlt, User, DatabaseIcon, LayersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BoardHeader } from "@/components/user-boards/BoardHeader";
import BoardInfoInputItem from "./BoardInfoInputItem";
import CollaboratingUsers from "./CollaboratingUsers";
import BoardNameField from "./BoardNameField";
import useSWR from "swr";
import { fetchBoardDetails } from "@/mock-data/BoardDetailsFetcher";
import BoardDetailsInfoSkeleton from "@/components/loading/BoardDetailsInfoSkeleton";
import BoardInfoItem from "./BoardInfoItem";

const BoardDetails: React.FC = () => {
  const boardId = "123";
  const { data: board, error, isLoading, mutate } = useSWR(`/mocked/boards/${boardId}`, fetchBoardDetails);

  if (isLoading) {
    return <BoardDetailsInfoSkeleton />;
  }

  if (error) {
    return (
      <section className="rounded-lg border border-destructive bg-card p-6 shadow">
        <BoardHeader title="Board Details" description="Board Information" />
        <p className="text-destructive">{error.message}</p>
      </section>
    );
  }

  if (!board) {
    return (
      <section className="rounded-lg border border-border bg-card p-6 shadow">
        <BoardHeader title="Board Details" description="Board Information" />
        <p>No board data.</p>
      </section>
    );
  }

  const creationDate = board.createdAt ? new Date(board.createdAt).toLocaleString() : "";
  const lastUpdated = board.modifiedAt ? new Date(board.modifiedAt).toLocaleString() : "";

  const totalSizeUsed = board.size;
  const usedPercentage = board.maxSize ? (totalSizeUsed / board.maxSize) * 100 : 0;

  const collaboratingUsers = [
    ...(board.permissions.viewer || []),
    ...(board.permissions.editor || []),
    ...(board.permissions.moderator || []),
  ];

  return (
    <section className="rounded-lg border border-border bg-card p-4 shadow">
      <header className="flex items-center justify-between gap-6 p-2">
        <BoardHeader
          title="Board Details"
          description="Detailed information regarding everything connected to this board"
        />
        <Button>Go to the board</Button>
      </header>

      <main className="mt-4 flex flex-col flex-wrap gap-24 p-2 lg:flex-row">
        <article className="flex flex-col lg:flex-[2]">
          <BoardNameField board={board} id={"board-name"} mutate={mutate} />

          <BoardInfoInputItem
            icon={<User className="mr-1 h-4 w-4" />}
            label="Owner"
            value={board.owner}
            id={"owner"}
            inputProps={{
              id: "owner",
              readOnly: true,
            }}
          />

          <BoardInfoInputItem
            icon={<FaCalendarAlt className="mr-1 h-4 w-4" />}
            label="Creation Date"
            id={"creation-date"}
            value={creationDate}
            inputProps={{
              id: "creation-date",
              readOnly: true,
            }}
          />

          <BoardInfoInputItem
            icon={<FaCalendarAlt className="mr-1 h-4 w-4" />}
            label="Last Updated"
            id={"last-updated"}
            value={lastUpdated}
            inputProps={{
              id: "last-updated",
              readOnly: true,
            }}
          />
          <BoardInfoItem icon={<DatabaseIcon className="mr-1 h-4 w-4" />} label="Used space">
            <div className="flex w-full items-center justify-between gap-4 text-xs">
              <Progress value={usedPercentage} className="w-full" />
              <Button variant="secondary" className="w-40 text-xs">
                <span className="text-muted-foreground">{`${totalSizeUsed} / ${board.maxSize} MB`}</span>
              </Button>
            </div>
          </BoardInfoItem>

          {/* Number of Slides */}
          <BoardInfoItem icon={<LayersIcon className="mr-1 h-4 w-4" />} label="No slides">
            <Button variant="outline" className="w-fit text-xs">
              <span className="text-muted-foreground">{`${board.slides.length} / 10`}</span>
            </Button>
          </BoardInfoItem>
        </article>

        <CollaboratingUsers users={collaboratingUsers} />
      </main>
    </section>
  );
};

export default BoardDetails;
