import { BoardPermissionNum } from "@/enums/BoardPermissionNum";
import { UserCapabilities } from "@/interfaces/user-capabilities";

export type CapabilityPermissionMap = {
  [K in keyof UserCapabilities]: BoardPermissionNum;
};
