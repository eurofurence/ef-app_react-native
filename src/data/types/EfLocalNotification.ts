import { EfId } from "@/data/types/EfId";

export type EfLocalNotification = {
  Id: string;
  TargetId: EfId;
  ScheduledUtc: string;
  CreatedUtc: string;
};
