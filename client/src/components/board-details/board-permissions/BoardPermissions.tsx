"use client";
import { BoardPermissionsUser } from "@/interfaces/board-permissions-user";
import { useCallback, useMemo, useState } from "react";
import { BoardPermission } from "@/enums/BoardPermission";
import { BoardHeader } from "@/components/user-boards/BoardHeader";
import BoardPermissionsInfoDialog from "@/components/board-details/board-permissions/BoardPermissionsInfoDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import BoardPermissionsSelect from "@/components/board-details/board-permissions/BoardPermissionsSelect";
import { BoardTableLeadRow } from "@/components/user-boards/board-table/BoardTableLeadRow";
import DeleteCollaboratorButton from "@/components/board-details/board-permissions/DeleteCollaboratorButton";
import { BoardDetailsResponse } from "@/interfaces/responses/board-details-response";
import logger from "@/lib/logger";
export const BoardPermissions = ({ board }: { board: BoardDetailsResponse }) => {
  const mapPermissions = useCallback((board: BoardDetailsResponse): BoardPermissionsUser[] => {
    const { viewer: viewers, editor: editors, moderator: moderators } = board.permissions;
    const users: BoardPermissionsUser[] = [];

    viewers.forEach((user) => {
      users.push({
        name: user.email, // Using email as name for display
        permission: BoardPermission.VIEWER,
      });
    });

    editors.forEach((user) => {
      users.push({
        name: user.email,
        permission: BoardPermission.EDITOR,
      });
    });

    moderators.forEach((user) => {
      users.push({
        name: user.email,
        permission: BoardPermission.MODERATOR,
      });
    });

    return users;
  }, []);

  const [users] = useState<BoardPermissionsUser[]>(mapPermissions(board));

  /**
   * Handle permission change for a user.
   * @param index - Index of the user in the users array.
   * @param newPermission - The new permission level selected.
   */
  const handlePermissionChange = (index: number, newPermission: BoardPermission) => {
    logger.log(`User ${users[index].name} permission changed to ${newPermission}`);
    /*todo: implement this method*/
  };

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => a.name.localeCompare(b.name));
  }, [users]);

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
              <AvatarFallback>{board.owner.email.slice(0, 2).toUpperCase()}</AvatarFallback>
              <AvatarImage src="https://via.placeholder.com/150" alt={board.owner.email} />
            </Avatar>
            <span className="font-bold text-foreground">{board.owner.email}</span>
          </div>
          <Button>
            <PlusIcon className="mr-2 h-5 w-5" />
            Add new user
          </Button>
        </div>
      </div>
      <Table>
        <BoardTableLeadRow columns={["User", "Permission"]} />
        <TableBody>
          {sortedUsers.map((user, index) => (
            <TableRow key={user.name} className="border-b border-border hover:bg-muted/50">
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
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

              <TableCell className="flex items-center justify-center">
                <DeleteCollaboratorButton
                  username={user.name}
                  deleteUser={() => {
                    /*todo: implement collaborator deletion*/
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
