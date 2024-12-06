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
import { capabilityFunctions } from "@/lib/permissionUtils";

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
                <div className={"flex flex-col"}>
                  <Badge>{sharedUsers[0]}</Badge>

                  <BoardDetailsLink board={board}>
                    <span className="text-xs text-muted-foreground">... (+{sharedUsers.length - 1} more)</span>
                  </BoardDetailsLink>
                </div>
              ) : (
                sharedUsers.map((user: string) => <Badge key={user}>{user}</Badge>)
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

const BoardDetailsLink = ({ board, children }: { board: BoardResponse; children: React.ReactNode }) => {
  const canViewBoardDetails = capabilityFunctions.canViewBoardDetails(board.permission);
  const hoverContent = canViewBoardDetails ? "See all shared users" : "You cannot see full list of shared users";

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        {canViewBoardDetails ? (
          <Link href={`/user-boards/${board._id}`} onClick={(e) => e.stopPropagation()}>
            {children}
          </Link>
        ) : (
          children
        )}
      </HoverCardTrigger>
      <HoverCardContent>{hoverContent}</HoverCardContent>
    </HoverCard>
  );
};
