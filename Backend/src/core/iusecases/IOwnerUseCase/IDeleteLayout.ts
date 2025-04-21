export interface IDeleteLayout {
    execute(busId: string): Promise<{
      success: boolean;
      message: string;
    }>;
  }
  