import { Route } from "../../entities/Route";

export interface IGetRoutes {
  execute(
    ownerId: string,
    searchQuery?: string,
    page?: number,
    limit?: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filters?: Record<string, any>
  ): Promise<{
    success: boolean;
    message: string;
    routes?: Route[];
  }>;
}
