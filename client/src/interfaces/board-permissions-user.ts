import { BoardPermission } from "@/enums/BoardPermission";

export interface BoardPermissionsUser {
  name: string;
  permission: BoardPermission;
  addedAt: string;
  invitedBy: string;
}
