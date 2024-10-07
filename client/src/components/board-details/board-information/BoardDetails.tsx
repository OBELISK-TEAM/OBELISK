"use client";

import React, { useState, useEffect, KeyboardEvent } from "react";
import { Pencil, Save, XCircle, Calendar as FaCalendarAlt, User, Square, DatabaseIcon, LayersIcon } from "lucide-react";
import useSWR from "swr";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BoardHeader } from "@/components/user-boards/BoardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

interface Slide {
  id: string;
  size: number;
}

interface BoardResponseObject {
  _id: string;
  name: string;
  owner: string;
  permissions: {
    viewer: string[];
    editor: string[];
    moderator: string[];
  };
  slides: Slide[];
  createdAt?: string;
  updatedAt?: string;
  maxSize?: number; // maximum allowed size in MB
}

interface BoardInfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  isEditing?: boolean;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  actions?: React.ReactNode;
}

const BoardInfoItem: React.FC<BoardInfoItemProps> = ({
  icon,
  label,
  value,
  inputProps,
  isEditing,
  onKeyDown,
  actions,
}) => (
  <div className="mb-4 flex flex-col gap-1">
    <div className="flex items-center">
      {icon}
      <Label className="text-sm font-semibold">{label}</Label>
    </div>
    <div className="flex items-center">
      <Input
        value={value}
        readOnly={!isEditing}
        onKeyDown={onKeyDown}
        className="h-10 w-full text-muted-foreground"
        {...inputProps}
      />
      {actions}
    </div>
  </div>
);

const CollaboratingUsers: React.FC<{ users: string[] }> = ({ users }) => (
  <Card className="max-h-[480px] overflow-y-scroll lg:flex-[1]">
    <CardHeader>
      <CardTitle className="flex items-center text-2xl">
        <span className={"text-2xl"}>Shared with</span>
      </CardTitle>
      <CardDescription>
        <p className="text-sm">List of users the board has been shared with</p>
      </CardDescription>
    </CardHeader>

    <CardContent className="mt-4">
      <Table>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={index}>
              <TableCell className="flex items-center">
                <Avatar className="mr-2 h-8 w-8">
                  <AvatarImage src={`/avatars/${user}.png`} alt={user} />
                  <AvatarFallback>AA</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{user}</p>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

export const BoardDetails: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [updating, setUpdating] = useState(false);

  const boardId = "123";

  const mockBoardData: Record<string, BoardResponseObject> = {
    "123": {
      _id: "123",
      name: "My Board",
      owner: "user123",
      permissions: {
        viewer: ["user1", "user2", "user5", "user6", "user7"],
        editor: ["user3"],
        moderator: ["user4", "user8", "user9", "user10"],
      },
      slides: [
        { id: "slide1", size: 10 },
        { id: "slide2", size: 15 },
        { id: "slide3", size: 12 },
        { id: "slide4", size: 8 },
        { id: "slide5", size: 5 },
        { id: "slide6", size: 20 },
        { id: "slide7", size: 7 },
        { id: "slide8", size: 9 },
        { id: "slide9", size: 11 },
      ],
      createdAt: String(new Date("2024-10-01T08:00:00Z")),
      updatedAt: String(new Date("2024-10-06T18:00:00Z")),
      maxSize: 100, // in MB
    },
  };

  const fetcher = async (url: string): Promise<BoardResponseObject> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const data = mockBoardData[boardId];
    if (!data) {
      throw new Error("Board not found.");
    }
    return data;
  };

  const { data: board, error, isLoading, mutate } = useSWR(`/api/boards/${boardId}`, fetcher);

  useEffect(() => {
    if (board) {
      setName(board.name);
    }
  }, [board]);

  const handleConfirm = async () => {
    if (!board) {
      return;
    }
    const trimmedName = name.trim();
    if (trimmedName === board.name) {
      setIsEditing(false);
      return;
    }

    try {
      setUpdating(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedBoard: BoardResponseObject = {
        ...board,
        name: trimmedName,
        updatedAt: String(new Date()),
      };

      await mutate(updatedBoard, false);
      setIsEditing(false);
    } catch (err: any) {
      // Handle error
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    if (board) {
      setName(board.name);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleConfirm();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

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
  const lastUpdated = board.updatedAt ? new Date(board.updatedAt).toLocaleString() : "";

  const totalSizeUsed = board.slides.reduce((sum, slide) => sum + slide.size, 0);
  const usedPercentage = board.maxSize ? (totalSizeUsed / board.maxSize) * 100 : 0;

  const collaboratingUsers = [
    ...(board.permissions.viewer || []),
    ...(board.permissions.editor || []),
    ...(board.permissions.moderator || []),
  ];

  return (
    <section className="rounded-lg border border-border bg-card p-4 shadow">
      <header className={"flex items-center justify-between gap-6 p-2"}>
        <BoardHeader
          title="Board Details"
          description="Detailed information regarding everything connected to this board"
        />
        <Button>Go to the board</Button>
      </header>

      {/* Begin flex container */}
      <main className="p mt-4 flex flex-col flex-wrap gap-24 p-2 lg:flex-row">
        {/* Left Column */}
        <article className="flex flex-col lg:flex-[2]">
          {/* Board Name */}
          <BoardInfoItem
            icon={<Square className="mr-1 h-4 w-4" />}
            label="Board name"
            value={name}
            isEditing={isEditing}
            onKeyDown={handleKeyDown}
            inputProps={{
              id: "board-name",
              onChange: (e) => setName(e.target.value),
              placeholder: "Board Name",
            }}
            actions={
              isEditing ? (
                <div className={"ml-2 flex items-center gap-2"}>
                  <Button
                    aria-label="Confirm name"
                    onClick={handleConfirm}
                    className={`${updating ? "cursor-not-allowed opacity-50" : ""}`}
                    disabled={updating}
                  >
                    <div className={"flex items-center gap-2"}>
                      <Save size={12} />
                      <span>Save</span>
                    </div>
                  </Button>
                  <Button
                    aria-label="Cancel edit"
                    variant="secondary"
                    onClick={handleCancel}
                    className={`${updating ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    <div className={"flex items-center gap-2"}>
                      <XCircle size={12} />
                      <span>Cancel</span>
                    </div>
                  </Button>
                </div>
              ) : (
                <Button variant="secondary" aria-label="Edit name" onClick={handleEditClick} className={"ml-2"}>
                  <div className={"flex items-center gap-2"}>
                    <Pencil size={12} />
                    <span>Edit</span>
                  </div>
                </Button>
              )
            }
          />

          {/* Owner */}
          <BoardInfoItem
            icon={<User className="mr-1 h-4 w-4" />}
            label="Owner"
            value={board.owner}
            inputProps={{
              id: "owner",
              readOnly: true,
            }}
          />

          {/* Creation Date */}
          <BoardInfoItem
            icon={<FaCalendarAlt className="mr-1 h-4 w-4" />}
            label="Creation Date"
            value={creationDate}
            inputProps={{
              id: "creation-date",
              readOnly: true,
            }}
          />

          {/* Last Updated */}
          <BoardInfoItem
            icon={<FaCalendarAlt className="mr-1 h-4 w-4" />}
            label="Last Updated"
            value={lastUpdated}
            inputProps={{
              id: "last-updated",
              readOnly: true,
            }}
          />

          {/* Used space */}
          <div className="mb-4 flex flex-col gap-1">
            <div className="flex items-center">
              <DatabaseIcon className="mr-1 h-4 w-4" />
              <span className="text-sm font-semibold">Used space</span>
            </div>
            <div className="flex w-full items-center justify-between gap-4 text-xs">
              <Progress value={usedPercentage} />
              <Button variant={"secondary"} className="w-40 text-xs">
                <span className={"text-muted-foreground"}>{`${totalSizeUsed} / ${board.maxSize} MB`}</span>
              </Button>
            </div>
          </div>

          {/* Number of slides */}
          <div className="mb-4 flex flex-col gap-1">
            <div className="flex items-center">
              <LayersIcon className="mr-1 h-4 w-4" />
              <span className="text-sm font-semibold">No slides</span>
            </div>
            <Button variant={"outline"} className="w-fit text-xs">
              <span className={"text-muted-foreground"}>{`${board.slides.length} / 10`}</span>
            </Button>
          </div>
        </article>

        {/* Collaborating Users */}
        <CollaboratingUsers users={collaboratingUsers} />
      </main>
    </section>
  );
};
