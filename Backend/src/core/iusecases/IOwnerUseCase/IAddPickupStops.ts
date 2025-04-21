export interface IAddPickupStops {
    execute(routeId: string, pickupStops: string[]): Promise<boolean>;
  }
  