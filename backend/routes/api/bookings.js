const express = require('express');
const { Review, User, Spot, ReviewImage, SpotImage, Booking, sequelize } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');

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

module.exports = router;