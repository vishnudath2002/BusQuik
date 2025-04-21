import { Bus } from "../../entities/Bus";

export interface IEditBus {
  execute(
    busId: string,
    updateData: Partial<Bus>
  ): Promise<{
    success: boolean;
    message: string;
    data: Bus | null;
  }>;
}
