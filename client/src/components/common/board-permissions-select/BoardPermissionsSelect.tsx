"use client";
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BoardPermission } from "@/enums/BoardPermission";
import { getPermissionLabel, getPermissionVariant } from "@/lib/userBoardsUtils";
import logger from "@/lib/logger";
import { toast } from "sonner";
import { ApiError } from "@/classes/errors/ApiError";
import { complexToastContext } from "@/contexts/ComplexToastContext";
import { ToastTypes } from "@/enums/ToastType";

interface PermissionSelectProps {
  boardMemberPermission: BoardPermission;
  onSendRequest?: (newPermission: BoardPermission) => Promise<void> | void;
  className?: string;
}

const BoardPermissionsSelect: React.FC<PermissionSelectProps> = ({
  boardMemberPermission,
  className,
  onSendRequest,
}) => {
  const permissions: BoardPermission[] = [BoardPermission.VIEWER, BoardPermission.EDITOR, BoardPermission.MODERATOR];

  const [selectedPermission, setSelectedPermission] = React.useState<BoardPermission>(boardMemberPermission);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleChange = async (newPermission: BoardPermission) => {
    if (!onSendRequest) {
      setSelectedPermission(newPermission);
      return;
    }
    setIsLoading(true);
    try {
      await onSendRequest(newPermission);
      setSelectedPermission(newPermission);
    } catch (error: any) {
      logger.error(`Failed to change permission`, error);
      if (error instanceof ApiError) {
        complexToastContext(ToastTypes.ERROR, error.messages, { duration: Infinity });
      } else {
        toast.error(error.message || "Failed to update permission");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Select
      value={selectedPermission}
      onValueChange={(value) => handleChange(value as BoardPermission)}
      disabled={isLoading}
    >
      <SelectTrigger className={"flex cursor-pointer justify-around " + className}>
        <SelectValue
          placeholder={
            <Badge variant={getPermissionVariant(selectedPermission)}>{getPermissionLabel(selectedPermission)}</Badge>
          }
        />
      </SelectTrigger>
      <SelectContent>
        {permissions.map((permission) => (
          <SelectItem
            key={permission}
            value={permission}
            disabled={permission === selectedPermission}
            className="flex cursor-pointer items-center justify-center"
          >
            <Badge variant={getPermissionVariant(permission)}>{getPermissionLabel(permission)}</Badge>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default BoardPermissionsSelect;
