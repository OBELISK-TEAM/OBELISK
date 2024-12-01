export enum StatisticsActiveTab {
  ACTIVITY = 1,
  TIME_SPENT = 2,
  PERMISSIONS_MANAGEMENT = 3,
}

export const StatisticsActiveTabMap: { [key in StatisticsActiveTab]: string } = {
  [StatisticsActiveTab.ACTIVITY]: "activity",
  [StatisticsActiveTab.TIME_SPENT]: "time-spent",
  [StatisticsActiveTab.PERMISSIONS_MANAGEMENT]: "permissions-management",
};

export const StatisticsActiveTabReverseMap: { [key: string]: StatisticsActiveTab } = {
  activity: StatisticsActiveTab.ACTIVITY,
  "time-spent": StatisticsActiveTab.TIME_SPENT,
  "permissions-management": StatisticsActiveTab.PERMISSIONS_MANAGEMENT,
};

export function statisticsActiveTabConverter(tab: string): StatisticsActiveTab | null {
  return StatisticsActiveTabReverseMap[tab] || null;
}
