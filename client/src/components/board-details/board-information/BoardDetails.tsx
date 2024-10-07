"use client";

import React, { useEffect, KeyboardEvent } from "react";
import { Calendar as FaCalendarAlt, User, DatabaseIcon, LayersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BoardHeader } from "@/components/user-boards/BoardHeader";
import BoardInfoItem from "./BoardInfoItem";
import CollaboratingUsers from "./CollaboratingUsers";
import BoardNameField from "./BoardNameField";
import { useBoardName } from "@/hooks/board-details/useBoardName";
import useSWR from "swr";
import { fetchBoardDetails } from "@/mock-data/BoardDetailsFetcher";

const BoardDetails: React.FC = () => {
  const boardId = "123";
  const { data: board, error, isLoading, mutate } = useSWR(`/mocked/boards/${boardId}`, fetchBoardDetails);

  const { name, isEditing, updating, setName, handleEditClick, handleCancel, handleConfirm } = useBoardName(
    board,
    mutate
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleConfirm();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  useEffect(() => {
    if (board) {
      setName(board.name);
    }
  }, [board, setName]);

  if (isLoading) {
    return (
      <section className="rounded-lg border border-border bg-card p-6 shadow">
        <BoardHeader title="Board Details" description="Board Information" />
        <p>Loading...</p>
      </section>
    );
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
          <BoardNameField
            name={name}
            isEditing={isEditing}
            updating={updating}
            setName={setName}
            handleKeyDown={handleKeyDown}
            handleEditClick={handleEditClick}
            handleConfirm={handleConfirm}
            handleCancel={handleCancel}
          />

          <BoardInfoItem
            icon={<User className="mr-1 h-4 w-4" />}
            label="Owner"
            value={board.owner}
            inputProps={{
              id: "owner",
              readOnly: true,
            }}
          />

          <BoardInfoItem
            icon={<FaCalendarAlt className="mr-1 h-4 w-4" />}
            label="Creation Date"
            value={creationDate}
            inputProps={{
              id: "creation-date",
              readOnly: true,
            }}
          />

          <BoardInfoItem
            icon={<FaCalendarAlt className="mr-1 h-4 w-4" />}
            label="Last Updated"
            value={lastUpdated}
            inputProps={{
              id: "last-updated",
              readOnly: true,
            }}
          />

          <div className="mb-4 flex flex-col gap-1">
            <div className="flex items-center">
              <DatabaseIcon className="mr-1 h-4 w-4" />
              <span className="text-sm font-semibold">Used space</span>
            </div>
            <div className="flex w-full items-center justify-between gap-4 text-xs">
              <Progress value={usedPercentage} />
              <Button variant="secondary" className="w-40 text-xs">
                <span className="text-muted-foreground">{`${totalSizeUsed} / ${board.maxSize} MB`}</span>
              </Button>
            </div>
          </div>

          <div className="mb-4 flex flex-col gap-1">
            <div className="flex items-center">
              <LayersIcon className="mr-1 h-4 w-4" />
              <span className="text-sm font-semibold">No slides</span>
            </div>
            <Button variant="outline" className="w-fit text-xs">
              <span className="text-muted-foreground">{`${board.slides.length} / 10`}</span>
            </Button>
          </div>
        </article>

        <CollaboratingUsers users={collaboratingUsers} />
      </main>
    </section>
  );
};

export default BoardDetails;
