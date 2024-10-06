import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BoardPermission } from "@/enums/BoardPermission";
import { getPermissionLabel, getPermissionVariant } from "@/lib/userBoardsUtils";
interface PermissionSelectProps {
  currentPermission: BoardPermission;
  onChange: (newPermission: BoardPermission) => void;
}
const BoardPermissionsSelect: React.FC<PermissionSelectProps> = ({ currentPermission, onChange }) => {
  const permissions: BoardPermission[] = [BoardPermission.VIEWER, BoardPermission.EDITOR, BoardPermission.MODERATOR];
  return (
    <Select onValueChange={(value) => onChange(value as BoardPermission)}>
      <SelectTrigger className="flex w-48 cursor-pointer justify-around">
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
