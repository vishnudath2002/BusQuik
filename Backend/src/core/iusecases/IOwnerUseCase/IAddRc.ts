import { Bus } from "../../entities/Bus";

export interface IAddRc {
  execute(
    busId: string,
    fileBuffer: Buffer
  ): Promise<{
    success: boolean;
    message: string;
    data: Bus | null;
  }>;
}
