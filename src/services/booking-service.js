const axios=require('axios');

const {BookingRepository}=require('../repository/index')
const {FLIGHT_SERVICE_PATH}=require('../config/serverConfig')
const {ServiceError}=require('../utils/errors')

class BookingService{
    constructor(){
        this.bookingRepository=new BookingRepository();
    }
    async createBooking(data){
        try{
            const flightId=data.flightId;

            let getFlightRequestURL=`${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            const response=await axios.get(getFlightRequestURL)
            const flightData=response.data.data;
            let priceOfTheFlight=flightData.price;
            if(data.noOfSeats>flightData.totalSeats){
                throw new ServiceError('Something went wrong in the booking process','Insufficient seats in flight')
            }
            const totalCost=priceOfTheFlight*data.noOfSeats;
            const bookingPayload={...data,totalCost};
            const booking=await this.bookingRepository.create(bookingPayload);
            const updateFlightRequestURL=`${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;

            console.log("Response from FlightAndSearchService",updateFlightRequestURL);

            await axios.patch(updateFlightRequestURL,{totalSeats: flightData.totalSeats - booking.noOfSeats})
            const finalBooking= await this.bookingRepository.update(booking.id,{status:"Booked"});
            return finalBooking;
            

        } catch(error){
            console.log("BOOKING SERVICE ",error);
            if(error.name=='RespositoryError'||error.name=='ValidationError'){
                throw error;
            }
            throw new ServiceError();
        }
        
    }
}
module.exports=BookingService;