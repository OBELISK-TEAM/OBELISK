import { PermissionsResponse } from "@/interfaces/responses/permissions-response";
import { UserResponse } from "@/interfaces/responses/user-response";

export interface BoardDetailsResponse {
  _id: string;
  name: string;
  owner: UserResponse;
  permission: string;
  permissions: PermissionsResponse;
  sizeInBytes: number;
  createdAt: string;
  updatedAt: string;
  maxBoardSizeInBytes: number;
  slideCount: number;
}
