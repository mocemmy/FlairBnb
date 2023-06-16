const express = require('express');
const { Review, User, Spot, ReviewImage, SpotImage, Booking, sequelize } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
//import custom validations:
const { validateDateInputs, validateBookingDate, validateBookingDateByBookingId } = require('../../utils/customValidations');

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
router.put('/:bookingId', requireAuth, validateDateInputs, async(req, res) => {
    const { user } = req; 
    const { startDate, endDate } = req.body;
    const booking = await Booking.findByPk(req.params.bookingId);
    if(!booking){
        res.statusCode = 404;
        return res.json({
            message: "Booking couldn't be found"
        })
    }
    if(user.id !== booking.userId){
        res.statusCode = 403;
        res.json({
            message: "Forbidden"
        })
    }
    booking.startDate = startDate;
    booking.endDate = endDate;
    await booking.save();
    res.json(booking);
} )

//Delete a Booking
router.delete('/:bookingId', requireAuth, async(req, res) => {
    const { user } = req;
    const booking = await Booking.findByPk(req.params.bookingId);
    if(!booking){
        res.statusCode = 404;
        return res.json({
            message: "Booking couldn't be found"
        })
    }
    const spot = await Spot.findByPk(booking.spotId)
    if(user.id !== booking.spotId && user.id !== spot.ownerId){
        res.statusCode = 403;
        return res.json({
            message: "Forbidden"
        })
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