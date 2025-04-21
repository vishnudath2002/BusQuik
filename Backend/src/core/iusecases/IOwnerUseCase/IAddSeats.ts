export interface IAddSeats {
    execute(
      busId: string,
      seatCount: number,
      rowLabel: string
    ): Promise<{
      success: boolean;
      message: string;
    }>;
  }
  