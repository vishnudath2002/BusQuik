import { Bus } from "../entities/Bus";
import { Types } from "mongoose";

export interface IBusRepository {
  addBus(bus: Bus): Promise<Bus | null>;
  getBusByOwnerId(
    ownerId: Types.ObjectId,
    searchQuery?: string,
    page?: number,
    limit?: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filters?: Record<string, any>
  ): Promise<Bus[]>;
  
  findById(busId: string): Promise<Bus | null>;
  updateBus(busId: string, updateData: Partial<Bus>): Promise<Bus | null>
  deleteBus(busId: string): Promise<boolean>;
 
}
