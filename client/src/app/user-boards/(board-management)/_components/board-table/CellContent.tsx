"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { concatenatePermissions, getPermissionLabel, getPermissionVariant } from "@/lib/userBoardsUtils";
import { BoardResponse } from "@/interfaces/responses/user-boards/board-response";
import { BoardTableColumns } from "@/enums/BoardTableColumns";
import { prettyDate } from "@/lib/dateUtils";
import { bytesToKilobytes } from "@/lib/bytesConverter";
import Link from "next/link";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export const CellContent = (column: BoardTableColumns, board: BoardResponse) => {
  let sharedUsers: string[] = [];
  if (board.permissions) {
    sharedUsers = concatenatePermissions(board.permissions);
  }

  switch (column) {
    case BoardTableColumns.NAME:
      return board.name;

    case BoardTableColumns.OWNER:
      return board?.owner?.email ?? "You";

    case BoardTableColumns.MODIFIED:
      return prettyDate(board.updatedAt);

    case BoardTableColumns.CREATED:
      return prettyDate(board.createdAt);

    case BoardTableColumns.MY_PERMISSION:
      if (board.permission) {
        return <Badge variant={getPermissionVariant(board.permission)}>{getPermissionLabel(board.permission)}</Badge>;
      } else {
        return "---";
      }

    case BoardTableColumns.SHARED_WITH:
      return (
        <div className="flex flex-col items-start space-y-1">
          {sharedUsers && sharedUsers.length > 0 ? (
            <>
              {sharedUsers.length > 2 ? (
                <BoardDetailsLink boardId={board._id}>
                  <Badge>{sharedUsers[0]}</Badge>
                  <span className="text-xs text-muted-foreground">... (+{sharedUsers.length - 1} more)</span>
                </BoardDetailsLink>
              ) : (
                sharedUsers.map((user: string) => (
                  <BoardDetailsLink key={user} boardId={board._id}>
                    <Badge key={user}>{user}</Badge>
                  </BoardDetailsLink>
                ))
              )}
            </>
          ) : (
            "---"
          )}
        </div>
      );

    case BoardTableColumns.SIZE:
      return `${bytesToKilobytes(board.sizeInBytes ?? 0)} kB`;

    default:
      return "";
  }
};

const BoardDetailsLink = ({ boardId, children }: { boardId: string; children: React.ReactNode }) => {
  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Link href={`/user-boards/${boardId}`} onClick={(e) => e.stopPropagation()}>
          {children}
        </Link>
      </HoverCardTrigger>
      <HoverCardContent>See all shared users</HoverCardContent>
    </HoverCard>
  );
};
