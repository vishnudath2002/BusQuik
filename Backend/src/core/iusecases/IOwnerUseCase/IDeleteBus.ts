export interface IDeleteBus {
    execute(busId: string): Promise<{
      success: boolean;
      message: string;
    }>;
  }
  