"use client";
import { BoardPermissionsUser } from "@/interfaces/board-permissions-user";
import { useState } from "react";
import { BoardPermission } from "@/enums/BoardPermission";
import { BoardHeader } from "@/components/user-boards/BoardHeader";
import BoardPermissionsInfoDialog from "@/components/board-details/BoardPermissions/BoardPermissionsInfoDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import BoardPermissionsSelect from "@/components/board-details/BoardPermissions/BoardPermissionsSelect";
import { BoardTableLeadRow } from "@/components/user-boards/board-table/BoardTableLeadRow";
export const BoardPermissions = () => {
  const [users, setUsers] = useState<BoardPermissionsUser[]>([
    {
      name: "Bnon Bnna",
      permission: BoardPermission.MODERATOR,
      addedAt: "2023-07-12 10:42 AM",
      invitedBy: "Anon Anna",
    },
    {
      name: "Cnon Cnna",
      permission: BoardPermission.VIEWER,
      addedAt: "yesterday 10:42 AM",
      invitedBy: "Anon Anna",
    },
    {
      name: "Dnon Dnna",
      permission: BoardPermission.EDITOR,
      addedAt: "yesterday 10:42 AM",
      invitedBy: "Bnon Bnna",
    },
    {
      name: "Enon Enna",
      permission: BoardPermission.EDITOR,
      addedAt: "yesterday 10:42 AM",
      invitedBy: "Cnon Cnna",
    },
  ]);
  const handlePermissionChange = (index: number, newPermission: BoardPermission) => {
    const updatedUsers = [...users];
    updatedUsers[index].permission = newPermission;
    setUsers(updatedUsers);
  };
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow">
      <div className="mb-6">
        <BoardHeader title={"Board permissions"} description={"How others can collaborate with you on this board"}>
          <BoardPermissionsInfoDialog />
        </BoardHeader>
        <div className="flex items-end justify-between p-2">
          <div className="mt-12 flex items-center space-x-4">
            <span className="text-muted-foreground">Board owner:</span>
            <Avatar>
              <AvatarFallback>AA</AvatarFallback>
              <AvatarImage src="https://via.placeholder.com/150" alt="Anon Anna" />
            </Avatar>
            <span className="font-bold text-foreground">Anon Anna</span>
          </div>
          <Button>
            <PlusIcon className="mr-2 h-5 w-5" />
            Add new user
          </Button>
        </div>
      </div>
      <Table>
        <BoardTableLeadRow columns={["User", "Permission", "Added At", "Invited By"]} />
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={user.name} className="border-b border-border hover:bg-muted/50">
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                    <AvatarImage src="https://via.placeholder.com/150" alt={user.name} />
                  </Avatar>
                  <span className="text-foreground">{user.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <BoardPermissionsSelect
                  currentPermission={user.permission}
                  onChange={(newPermission) => handlePermissionChange(index, newPermission)}
                />
              </TableCell>
              <TableCell className="text-foreground">{user.addedAt}</TableCell>
              <TableCell className="text-foreground">{user.invitedBy}</TableCell>
              <TableCell className="flex items-center justify-center">
                <Button variant="outline" className="hover:text-muted-foreground">
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
