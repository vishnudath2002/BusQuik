import { Layout } from "../../entities/Layout";

export interface IGetLayout {
  execute(busId: string): Promise<{
    success: boolean;
    message: string;
    layouts?: Layout[];
  }>;
}
