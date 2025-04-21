import { Schedule } from "../../entities/Schedule";

export interface IAddSchedule {
    execute(schedule: Schedule): Promise<{
      success: boolean;
      message: string;
      result: Schedule | string | null | Schedule[];
    }>;
  }
  