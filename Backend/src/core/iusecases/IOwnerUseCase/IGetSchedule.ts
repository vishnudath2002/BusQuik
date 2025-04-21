import { Schedule } from "../../entities/Schedule";

export interface IGetSchedule {
  execute(ownerId: string): Promise<{
    success: boolean;
    message: string;
    schedules?: Schedule[];
  }>;
}
