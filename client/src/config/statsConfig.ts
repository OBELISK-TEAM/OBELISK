import { addMinutes } from "date-fns";

export const statsConfig = {
  activeUsers: "active-users",
  defaultStartDate: addMinutes(new Date(), -480),
};
