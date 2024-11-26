export enum BoardsActiveTab {
  OWNED_BY = 1,
  SHARED_FOR = 2,
}

export const BoardsActiveTabMap: { [key in BoardsActiveTab]: string } = {
  [BoardsActiveTab.OWNED_BY]: "OWNED_BY",
  [BoardsActiveTab.SHARED_FOR]: "SHARED_FOR",
};

export const BoardsActiveTabReverseMap: { [key: string]: BoardsActiveTab } = {
  OWNED_BY: BoardsActiveTab.OWNED_BY,
  SHARED_FOR: BoardsActiveTab.SHARED_FOR,
};

export function boardActiveTabConverter(tab: string): BoardsActiveTab | null {
  return BoardsActiveTabReverseMap[tab] || null;
}
