import { ILayouts } from "../../../api/infrastructure/db/models/Layouts";

export interface IUpdateLayout {
  execute(
    layoutId: string,
    updatedData: Partial<ILayouts>
  ): Promise<{
    success: boolean;
    message: string;
    updatedLayout?: ILayouts;
  }>;
}
