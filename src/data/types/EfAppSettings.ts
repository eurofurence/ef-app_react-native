import { ThemeName } from "@/context/Theme";

export type EfAppSettings = {
  Theme: ThemeName | null;
  AnalyticsEnabled: boolean;
  Language: string | null;
  DevMenuEnabled: boolean;
  TimeTravelEnabled: boolean;
  TimeTravelOffset: number;
};
