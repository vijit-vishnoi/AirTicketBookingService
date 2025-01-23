const {StatusCodes}=require('http-status-codes');
const {Booking} =require('../models/index')
const { AppError, ValidationError } = require('../utils/errors/index')

class BookingRepository{
    async create(data){
        try{
            const booking=await Booking.crate(data);
            return booking;
        } catch (error){
            if(error.name=='SequelizeValidationError'){
                throw new ValidationError(error);
            }
            throw new AppError('RepositoryError',
            'Cannot create Booking',
            'There was some issue crating the booking please try again later',
            StatusCodes.INTERNAL_SERVR_ERROR
            );
        }
    }
    
}
module.exports=BookingRepository;