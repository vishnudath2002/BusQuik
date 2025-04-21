import { User } from "../../entities/User";

export interface IGetOperators {
  execute(): Promise<{
    success: boolean;
    message: string;
    operators?: User[];
  }>;
}
