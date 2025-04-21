export interface IDeleteRoute {
    execute(busId: string): Promise<{
      success: boolean;
      message: string;
    }>;
  }
  