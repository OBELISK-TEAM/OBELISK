import { UserCapabilities } from "@/interfaces/user-capabilities";

export type CapabilityFunctions = {
  [K in keyof UserCapabilities]: (currentPermission: string | undefined) => boolean;
};
