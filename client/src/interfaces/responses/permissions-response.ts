import { UserResponse } from "@/interfaces/responses/user-response";

export interface PermissionsResponse {
  viewer: UserResponse[];
  editor: UserResponse[];
  moderator: UserResponse[];
}
