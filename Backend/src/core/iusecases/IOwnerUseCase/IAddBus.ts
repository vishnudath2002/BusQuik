import { Bus } from "../../entities/Bus";

export interface IAddBus {
  execute(bus: Bus): Promise<{
    success: boolean;
    message: string;
    data: Bus | null;
  }>;
}
