import { SlideResponse } from "@/interfaces/slide-response";
import { PermissionsResponse } from "@/interfaces/permissions-response";

export interface BoardDataResponse {
  _id: string;
  name: string;
  owner: string;
  permissions: PermissionsResponse;
  slides: string[];
  slide?: SlideResponse;
}
