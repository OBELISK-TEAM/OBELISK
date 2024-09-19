import { SlideResponse } from "@/interfaces/slide-response";

export interface BoardDataResposne {
  _id: string;
  name: string;
  owner: string;
  permissions: Permissions;
  slides: string[];
  slide?: SlideResponse;
}
