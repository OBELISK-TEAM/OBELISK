"use client";
import { BoardPermissionsUser } from "@/interfaces/board-permissions-user";
import React from "react";
import { BoardPermission } from "@/enums/BoardPermission";
import { BoardHeader } from "@/components/user-boards/BoardHeader";
import BoardPermissionsInfoDialog from "@/components/board-details/board-permissions/BoardPermissionsInfoDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import BoardPermissionsSelect from "@/components/board-details/board-permissions/BoardPermissionsSelect";
import { BoardTableLeadRow } from "@/components/user-boards/board-table/BoardTableLeadRow";
import DeleteCollaboratorButton from "@/components/board-details/board-permissions/DeleteCollaboratorButton";
import { BoardDetailsResponse } from "@/interfaces/responses/board-details-response";
import ShareBoardDialog from "@/components/board-details/board-permissions/ShareBoardDialog";
import { boardPermissionToNum, capabilityFunctions } from "@/lib/permissionUtils";
import { Badge } from "@/components/ui/badge";
import { getPermissionLabel, getPermissionVariant } from "@/lib/userBoardsUtils";
import { modifyPermission } from "@/app/actions/permissionsActions";
import { BoardPermissionModifyRequest } from "@/interfaces/requests/board-permission-modify-request";
import logger from "@/lib/logger";
import { useAuth } from "@/contexts/AuthContext";

export const BoardPermissions = ({ board }: { board: BoardDetailsResponse }) => {
  const { decodedToken } = useAuth();
  const users: BoardPermissionsUser[] = React.useMemo(() => {
    const mapPermissionsAndSortUsers = (board: BoardDetailsResponse): BoardPermissionsUser[] => {
      const { viewer: viewers, editor: editors, moderator: moderators } = board.permissions;
      const users: BoardPermissionsUser[] = [];

      viewers.forEach((user) => {
        users.push({
          name: user.email,
          permission: BoardPermission.VIEWER,
          id: user._id,
        });
      });

      editors.forEach((user) => {
        users.push({
          name: user.email,
          permission: BoardPermission.EDITOR,
          id: user._id,
        });
      });

      moderators.forEach((user) => {
        users.push({
          name: user.email,
          permission: BoardPermission.MODERATOR,
          id: user._id,
        });
      });

      users.sort((a, b) => a.name.localeCompare(b.name));
      return users;
    };

    return mapPermissionsAndSortUsers(board);
  }, [board]);

  const handlePermissionChange = async (index: number, newPermission: BoardPermission) => {
    const user = users[index];
    logger.log(`Changing permission for user:${users[index].name} to ${newPermission}`);
    const boardPermissionModifyRequest: BoardPermissionModifyRequest = {
      userId: user.id,
      permission: boardPermissionToNum(newPermission),
    };
    await modifyPermission(board._id, boardPermissionModifyRequest); //note: I don't want to throw an error here, it should be handled in the BoardPermissionsSelect component
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
              <AvatarFallback>{board.owner.email.slice(0, 2).toUpperCase()}</AvatarFallback>
              <AvatarImage src="#" alt={board.owner.email} />
            </Avatar>
            <span className="font-bold text-foreground">{board.owner.email}</span>
          </div>

          {capabilityFunctions.canManageUsersPermissions(board.permission) && (
            <ShareBoardDialog boardId={board._id}>
              <Button>
                <Share2 className="mr-2 h-5 w-5" />
                Share with others
              </Button>
            </ShareBoardDialog>
          )}
        </div>
      </div>
      <Table>
        <BoardTableLeadRow columns={["User", "Permission"]} />
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={user.id} className="border-b border-border hover:bg-muted/50">
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    <AvatarImage src="#" alt={user.name} />
                  </Avatar>
                  <span className="text-foreground">{user.name}</span>
                </div>
              </TableCell>
              <TableCell>
                {capabilityFunctions.canManageUsersPermissions(board.permission) && user.id !== decodedToken?._id ? (
                  <BoardPermissionsSelect
                    boardMemberPermission={user.permission}
                    onSendRequest={async (newPermission) => {
                      await handlePermissionChange(index, newPermission);
                    }}
                  />
                ) : (
                  <Badge variant={getPermissionVariant(user.permission)}>{getPermissionLabel(user.permission)}</Badge>
                )}
              </TableCell>

              <TableCell className="flex items-center justify-center">
                {capabilityFunctions.canManageUsersPermissions(board.permission) && user.id !== decodedToken?._id && (
                  <DeleteCollaboratorButton user={user} boardId={board._id} />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
