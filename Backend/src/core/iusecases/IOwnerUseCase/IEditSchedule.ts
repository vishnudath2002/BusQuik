import { Schedule } from "../../entities/Schedule";

export interface IEditSchedule {
  execute(
    scheduleId: string,
    updateData: Partial<Schedule>
  ): Promise<{
    success: boolean;
    message: string;
    data: Schedule | null;
  }>;
}
