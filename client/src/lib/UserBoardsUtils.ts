// UserBoardsUtils.ts

export const getColumnsForTab = (tab: string): string[] => {
  if (tab === "Latest") {
    return ["Name", "Owner", "Modified at", "Created at", "Your Permissions", "Shared with", "Size (in kB)"];
  } else if (tab === "Owned by you") {
    return ["Name", "Modified at", "Created at", "Shared with", "Size (in kB)"];
  } else if (tab === "Shared by others") {
    return ["Name", "Owner", "Modified at", "Created at", "Your Permissions", "Shared with", "Size (in kB)"];
  }
  return [];
};

export const getTitleForTab = (tab: string): string => {
  if (tab === "Latest") {
    return "Latest boards";
  } else if (tab === "Owned by you") {
    return "Your boards";
  } else if (tab === "Shared by others") {
    return "Boards shared with you";
  }
  return "";
};

export const getDescriptionForTab = (tab: string): string => {
  if (tab === "Latest") {
    return "Boards you have worked with recently.";
  } else if (tab === "Owned by you") {
    return "Boards created by you";
  } else if (tab === "Shared by others") {
    return "By other users";
  }
  return "";
};

export const getPermissionBgColor = (permission: string) => {
  switch (permission) {
    case "Editing":
      return "bg-green-500";
    case "Sharing":
      return "bg-orange-500";
    case "Reading":
      return "bg-blue-500";
    case "Owner":
      return "bg-black";
    default:
      return "bg-gray-500";
  }
};
