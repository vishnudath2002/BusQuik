import { Route } from "../../entities/Route";

export interface IEditRoute {
  execute(
    routeId: string,
    updateData: Partial<Route>
  ): Promise<{
    success: boolean;
    message: string;
    data: Route | null;
  }>;
}