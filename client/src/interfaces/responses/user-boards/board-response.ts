import { PermissionsResponse } from "@/interfaces/responses/permissions-response";
import { BoardPermission } from "@/enums/BoardPermission";

export interface BoardResponse {
  _id: string;
  name: string;
  modifiedAt: string;
  createdAt: string;
  size: number;
  sharedWith: PermissionsResponse;
  owner?: string;
  myPermission?: BoardPermission;
}
