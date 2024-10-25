import { PermissionsResponse } from "@/interfaces/responses/permissions-response";
import { BoardPermission } from "@/enums/BoardPermission";
import { SlideResponse } from "@/interfaces/responses/slide-response";
import { UserResponse } from "@/interfaces/responses/user-response";

export interface BoardResponse {
  _id: string;
  name: string;
  updatedAt: string;
  createdAt: string;
  sizeInBytes?: number;
  permissions?: PermissionsResponse;
  slides: string[];
  slide?: SlideResponse | string;
  owner?: UserResponse;
  permission?: BoardPermission;
}
