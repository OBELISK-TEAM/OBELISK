import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BoardPermission } from "@/enums/BoardPermission";
import { getPermissionLabel, getPermissionVariant } from "@/lib/userBoardsUtils";
interface PermissionSelectProps {
  currentPermission: BoardPermission;
  onChange: (newPermission: BoardPermission) => void;
  className?: string;
}
const BoardPermissionsSelect: React.FC<PermissionSelectProps> = ({ currentPermission, className, onChange }) => {
  const permissions: BoardPermission[] = [BoardPermission.VIEWER, BoardPermission.EDITOR, BoardPermission.MODERATOR];
  return (
    <Select onValueChange={(value) => onChange(value as BoardPermission)}>
      <SelectTrigger className={"flex cursor-pointer justify-around" + className}>
        <SelectValue
          placeholder={
            <Badge variant={getPermissionVariant(currentPermission)}>{getPermissionLabel(currentPermission)}</Badge>
          }
        />
      </SelectTrigger>
      <SelectContent>
        {permissions.map((permission) => (
          <SelectItem
            key={permission}
            value={permission}
            disabled={permission === currentPermission}
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
