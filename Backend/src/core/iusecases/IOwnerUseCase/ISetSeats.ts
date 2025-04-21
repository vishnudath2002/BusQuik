export interface ISetSeats {
    execute(
      busId: string,
      scheduleId: string,
      availability: { date: Date; isAvailable: boolean }[]
    ): Promise<boolean>;
  }
  