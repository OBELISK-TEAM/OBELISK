import { UserActions } from "@/interfaces/user-actions";

export type ActionFunctions = {
  [K in keyof UserActions]: (currentPermission: string | undefined) => boolean;
};
