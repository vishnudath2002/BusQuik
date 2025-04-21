import { IBookingRepository } from "../../interfaces/IBookingRepository";
import { ISeatRepository } from "../../interfaces/ISeatRepository";
// import { IEmailService } from "../../interfaces/IEmailService";
import { IWalletRepository } from "../../interfaces/IWalletRepository";

export class CancelTickets {
    constructor(
        private bookingRepository: IBookingRepository,
        private seatRepository: ISeatRepository,
        // private emailRepository: IEmailService,
        private walletRepository: IWalletRepository
    ) {}

    async execute(bookingId: string, seatNumbers: string[]) {
        try {
            const booking = await this.bookingRepository.findById(bookingId);
            if (!booking) {
                return { success: false, message: "Booking not found." };
            }

        

         
            const seatIds = await this.seatRepository.getSeatIdsByNumbers(seatNumbers,booking.busId);
            if (!seatIds || seatIds.length === 0) {
                return { success: false, message: "No valid seats found for cancellation." };
            }

            

            const cancelBookingSeats = await this.bookingRepository.removeBookedSeats(booking.id,seatIds)
            console.log(cancelBookingSeats)

            const seatUpdateResult = await this.seatRepository.updateSeatAvailability(
                booking.busId,
                booking.date.toISOString().split('T')[0], 
                seatNumbers,
                booking.scheduleId,
                true
            );


            console.log("Seat availability updated:", seatUpdateResult);

      
         

        
            const refundAmount = Number(booking.amount) * seatNumbers.length;
            const walletResult = await this.walletRepository.addMoney(booking.userId, refundAmount);

            console.log("Refund processed:", walletResult);

            return { success: true, message: "Seats cancelled successfully." };

        } catch (error) {
            console.error("Error in CancelSeats:", error);
            return { success: false, message: "An error occurred while cancelling seats." };
        }
    }
}
