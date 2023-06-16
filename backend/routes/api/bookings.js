const express = require('express');
const { Review, User, Spot, ReviewImage, SpotImage, Booking, sequelize } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
//import custom validations:
const { validateDateInputs, validateBookingDate, validateBookingDateByBookingId, unauthorizedUser, validateBookingById } = require('../../utils/customValidations');

const router = express.Router();

//Get all of the Current User's Bookings
router.get('/current', requireAuth, async(req, res) => {
    const { user } = req;
    let Bookings = await Booking.findAll({
        where: {
            userId: user.id
        },
        include: [
            {
                model: Spot,
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
                include: [
                    {
                        model: SpotImage,
                        attributes: ['url']
                    }
                ]
            },
            
        ],
        
    })
    Bookings = Bookings.map(booking => booking.toJSON());
    Bookings.forEach(booking => {
        booking.Spot.previewImage = booking.Spot.SpotImages[0].url;
        delete booking.Spot.SpotImages
    })
    res.json({Bookings})
})

//Edit a Booking
router.put('/:bookingId', requireAuth, validateBookingById, validateDateInputs, validateBookingDateByBookingId, async(req, res) => {
    const { user } = req; 
    const { startDate, endDate } = req.body;
    const booking = await Booking.findByPk(req.params.bookingId);
    if(user.id !== booking.userId){
        unauthorizedUser();
    }
    booking.startDate = startDate;
    booking.endDate = endDate;
    await booking.save();
    res.json(booking);
} )

//Delete a Booking
router.delete('/:bookingId', requireAuth, validateBookingById, async(req, res) => {
    const { user } = req;
    const booking = await Booking.findByPk(req.params.bookingId);
    const spot = await Spot.findByPk(booking.spotId)
    if(user.id !== booking.userId && user.id !== spot.ownerId){
        unauthorizedUser();
    };
    const currentDate = new Date();
    if(currentDate >= booking.startDate){
        res.statusCode = 403;
        return res.json({
            message: "Bookings that have been started can't be deleted"
        })
    }
    await booking.destroy();
    res.json({
        message: "Successfully Deleted"
    })
})

module.exports = router;