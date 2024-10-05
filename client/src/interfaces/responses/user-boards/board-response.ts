import { PermissionsResponse } from "@/interfaces/responses/permissions-response";
import { BoardPermission } from "@/enums/BoardPermission";
import { SlideResponse } from "@/interfaces/responses/slide-response";

export interface BoardResponse {
  _id: string;
  name: string;
  modifiedAt: string;
  createdAt: string;
  size: number;
  permissions: PermissionsResponse;
  slides: string[];
  slide?: SlideResponse | string;
  owner?: string;
  currentUserPermission?: BoardPermission;
}
