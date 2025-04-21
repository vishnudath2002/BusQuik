import { Route } from "../../entities/Route";

export interface IAddRoute {
  execute(route: Route): Promise<{
    success: boolean;
    message: string;
  }>;
}
