import { IRouteRepository } from "../../interfaces/IRouteRepository";
import { Route } from "../../entities/Route";

interface GetRoutesResponse {
  success: boolean;
  message: string;
  routes?: Route[];
}

export class GetRoutes {
  constructor(private routeRepository: IRouteRepository) {}

  async execute(
    ownerId: string,
    searchQuery: string = '',
    page: number = 1,
    limit: number = 10,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filters: Record<string, any> = {}
  ): Promise<GetRoutesResponse> {
    const routes = await this.routeRepository.getRoutesByOwnerId(
      ownerId,
      searchQuery,
      page,
      limit,
      filters
    );

    if (routes.length === 0) {
      return {
        success: false,
        message: "No routes found for the given owner ID",
        routes: [],
      };
    }

    return {
      success: true,
      message: "Routes found",
      routes,
    };
  }
}
