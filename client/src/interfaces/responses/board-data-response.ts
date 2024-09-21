import { SlideResponse } from "@/interfaces/responses/slide-response";
import { PermissionsResponse } from "@/interfaces/responses/permissions-response";

export interface BoardDataResponse {
  _id: string;
  name: string;
  owner: string;
  permissions: PermissionsResponse;
  slides: string[];
  slide?: SlideResponse;
}
