import { BoardsActiveTab } from "@/enums/BoardsActiveTab";
import { BoardTableColumns } from "@/enums/BoardTableColumns";
import { BoardPermission } from "@/enums/BoardPermission";
import { PermissionsResponse } from "@/interfaces/responses/permissions-response";

const detailedBoards: BoardTableColumns[] = [
  BoardTableColumns.NAME,
  BoardTableColumns.OWNER,
  BoardTableColumns.MODIFIED_AT,
  BoardTableColumns.CREATED_AT,
  BoardTableColumns.MY_PERMISSION,
  BoardTableColumns.SHARED_WITH,
  BoardTableColumns.SIZE,
];

const ownedBoards: BoardTableColumns[] = [
  BoardTableColumns.NAME,
  BoardTableColumns.MODIFIED_AT,
  BoardTableColumns.CREATED_AT,
  BoardTableColumns.SHARED_WITH,
  BoardTableColumns.SIZE,
];

export const getColumnsForTab = (tab: BoardsActiveTab): BoardTableColumns[] => {
  if (tab === BoardsActiveTab.SHARED_FOR) {
    return detailedBoards;
  } else if (tab === BoardsActiveTab.OWNED_BY) {
    return ownedBoards;
  }
  return [];
};

export const getTitleForTab = (tab: BoardsActiveTab): string => {
  switch (tab) {
    case BoardsActiveTab.OWNED_BY:
      return "Your boards";
    case BoardsActiveTab.SHARED_FOR:
      return "Boards shared with you";
    default:
      return "";
  }
};

export const getDescriptionForTab = (tab: BoardsActiveTab): string => {
  switch (tab) {
    case BoardsActiveTab.OWNED_BY:
      return "Boards created by you";
    case BoardsActiveTab.SHARED_FOR:
      return "By other users";
    default:
      return "";
  }
};

export const getPermissionVariant = (permission: BoardPermission): "editor" | "moderator" | "viewer" | "default" => {
  switch (permission) {
    case BoardPermission.EDITOR:
      return "editor";
    case BoardPermission.MODERATOR:
      return "moderator";
    case BoardPermission.VIEWER:
      return "viewer";
    default:
      return "default";
  }
};

export const getPermissionLabel = (permission: BoardPermission): string => {
  switch (permission) {
    case BoardPermission.EDITOR:
      return "editor";
    case BoardPermission.MODERATOR:
      return "moderator";
    case BoardPermission.VIEWER:
      return "viewer";
    case BoardPermission.OWNER:
      return "owner";
    default:
      return "none";
  }
};

export const concatenatePermissions = (permissions: PermissionsResponse): string[] => {
  return [
    ...(permissions.viewer.map((e) => e.email) || []),
    ...(permissions.editor.map((e) => e.email) || []),
    ...(permissions.moderator.map((e) => e.email) || []),
  ];
};
