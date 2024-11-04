import { BoardPermissionNum } from "@/enums/BoardPermissionNum";
import { UserActions } from "@/interfaces/user-actions";

export type ActionPermissionMap = {
  [K in keyof UserActions]: BoardPermissionNum;
};
