export interface IDeleteSchedule {
    execute(scheduleId: string): Promise<{
      success: boolean;
      message: string;
    }>;
  }
  