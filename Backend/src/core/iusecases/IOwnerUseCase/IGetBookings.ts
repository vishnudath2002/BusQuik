import { Booking } from "../../entities/Booking";

export interface GetBookingsResponse {
  success: boolean;
  message: string;
  scheduleIds?: string[];  
  bookings?: Booking[];   
}

export interface IGetBookings {
  execute(ownerId: string): Promise<GetBookingsResponse>;
}


