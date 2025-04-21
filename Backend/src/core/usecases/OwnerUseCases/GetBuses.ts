import { Bus } from "../../entities/Bus";
import { IBusRepository } from "../../interfaces/IBusRepository";
import { Types } from "mongoose";

interface GetBusesResponse {
  success: boolean;
  message: string;
  buses?: Bus[];
}

export class GetBuses {
  constructor(private busRepository: IBusRepository) {}

  async execute(
    ownerId: string,
    searchQuery: string = '',
    page: number = 1,
    limit: number = 10,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filters: Record<string, any> = {}
  ): Promise<GetBusesResponse> {
    const buses = await this.busRepository.getBusByOwnerId(
      new Types.ObjectId(ownerId),
      searchQuery,
      page,
      limit,
      filters
    );

    if (buses.length === 0) {
      return {
        success: false,
        message: "No buses found for the given owner ID",
        buses: [],
      };
    }

    return {
      success: true,
      message: "Buses found",
      buses: buses,
    };
  }
}
