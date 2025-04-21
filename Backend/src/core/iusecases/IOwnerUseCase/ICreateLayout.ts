

export interface LayoutConfig {
  rows: number;
  columnConfig: Array<number | "aisle">[];
  busId: string;
}

export interface ICreateLayout {
  execute(config: LayoutConfig): Promise<{
    success: boolean;
    message: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result?: any; // You can replace `any` with a more specific type if you have one for the layout model
  }>;
}
