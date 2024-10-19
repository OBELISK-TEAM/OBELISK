"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BoardHeader } from "@/components/user-boards/BoardHeader";
import BoardInfoInputItem from "./BoardInfoInputItem";
import CollaboratingUsers from "./CollaboratingUsers";
import BoardNameField from "./BoardNameField";
import BoardInfoItem from "./BoardInfoItem";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { BoardDetailsResponse } from "@/interfaces/responses/board-details-response";

interface BoardDetailsProps {
  board: BoardDetailsResponse | undefined;
}
const BoardDetails: React.FC<BoardDetailsProps> = ({ board }) => {
  const router = useRouter();

  if (!board) {
    return (
      <section className="rounded-lg border border-border bg-card p-6 shadow">
        <BoardHeader title="Board Details" description="Board Information" />
        <p>No board data.</p>
      </section>
    );
  }

  const creationDate = board.createdAt ? new Date(board.createdAt).toLocaleString() : "";
  const lastUpdated = board.updatedAt ? new Date(board.updatedAt).toLocaleString() : "";

  const totalSizeUsed = board.sizeInBytes;
  const usedPercentage = board.maxSizeInBytes ? (totalSizeUsed / board.maxSizeInBytes) * 100 : 0;

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
        <Button
          onClick={() => {
            router.push(`/user-boards/${board._id}/slides/1`);
          }}
        >
          Go to the board
        </Button>
      </header>

      <main className="mt-4 flex flex-col flex-wrap gap-24 p-2 lg:flex-row">
        <article className="flex flex-col lg:flex-[2]">
          <BoardNameField
            board={board}
            id={"board-name"}
            mutate={() => {
              /*todo: implement changing board name*/
            }}
          />

          <BoardInfoInputItem
            label="Owner"
            value={board.owner.email}
            id={"owner"}
            inputProps={{
              id: "owner",
              readOnly: true,
            }}
          />

          <BoardInfoInputItem
            label="Creation Date"
            id={"creation-date"}
            value={creationDate}
            inputProps={{
              id: "creation-date",
              readOnly: true,
            }}
          />

          <BoardInfoInputItem
            label="Last Updated"
            id={"last-updated"}
            value={lastUpdated}
            inputProps={{
              id: "last-updated",
              readOnly: true,
            }}
          />
          <BoardInfoItem label="Used space">
            <div className="flex w-full items-center justify-between gap-4 text-xs">
              <Progress value={usedPercentage} className="w-full" />
              <Badge variant="secondary" className="border-1 h-10 w-40 rounded-md px-4 py-2 text-xs">
                <span className="text-muted-foreground">{`${(totalSizeUsed / 1024).toFixed(2)} / ${(board.maxSizeInBytes / 1024).toFixed(2)} KB`}</span>
              </Badge>
            </div>
          </BoardInfoItem>

          {/* Number of Slides */}
          <BoardInfoItem label="No slides">
            <Badge variant="outline" className="h-10 w-fit rounded-md px-4 py-2 text-xs">
              <span className="text-muted-foreground">{`${board.slideCount} / 10`}</span>
            </Badge>
          </BoardInfoItem>
        </article>

        <CollaboratingUsers users={collaboratingUsers} />
      </main>
    </section>
  );
};

export default BoardDetails;
