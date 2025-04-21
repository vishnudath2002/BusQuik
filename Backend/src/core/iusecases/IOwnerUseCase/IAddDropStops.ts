export interface IAddDropStops {
    execute(routeId: string, dropStops: string[]): Promise<boolean>;
  }
  