const express = require('express');
const { Op } = require('sequelize');
// const bcrypt = require('bcryptjs');
const { Spot, Review, SpotImage, User, Booking, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { validationResult } = require('express-validator');
//import customValidations
const { handleDateValidation, validateSpot, validateReview, validateDateInputs, validateBookingDate, validateSpotById, unauthorizedUser} = require('../../utils/customValidations');

const router = express.Router();




//GET all spots:
router.get('/', async(req, res) => {
    //find all spots
    const spots = await Spot.findAll({
        include: [
            {
                model: Review,
                attributes: []
            },
            {
                //add previewImage for each spot
                model: SpotImage,
                attributes: []
            }
        ],
        attributes: {
            //add avgRating for each spot
            include: [
                [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgRating'],
                [sequelize.col('SpotImages.url'), 'previewImage']
            ]
        },
        group: ['Spot.id', 'SpotImages.url']
    });
    res.json({spots});
})

//Get all spots owned by the current user:
router.get('/current', requireAuth, async(req, res) => {
    const { user } = req;
    const spots = await Spot.findAll({
        where: {
            "ownerId": user.toJSON().id
        },
        include: [
            {
                model: Review,
                attributes: []
            },
            {
                model: SpotImage,
                attributes: []
            }
        ],
        attributes: {
            include: [
                [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgRating'],
                [sequelize.col('SpotImages.url'), 'previewImage']
            ]
        },
        group: ['Spot.id', 'SpotImages.url']

    })
    res.json({spots});
    
})

//Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, validateSpotById, async(req, res) => {
    const { user } = req;
    const spot = await Spot.findByPk(req.params.spotId);
    let Bookings;
    if(user.id !== spot.ownerId){ //if user is NOT the owner
        Bookings = await Booking.findAll({
            where: {
                spotId: spot.id
            },
            attributes: ['spotId', 'startDate', 'endDate']
        })
    }
    if(user.id === spot.ownerId) { //if user owns the spot
        Bookings = await Booking.findAll({
            where: {
                spotId: spot.id
            },
            include: [{
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            }]
        })
    }

    res.json({Bookings})
})

//Get all Reviews by a Spot's id
router.get('/:spotId/reviews', validateSpotById, async(req, res) => {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);
    const Reviews = await Review.findAll({
        where: {
            spotId: spotId
        }
    })

    res.json({Reviews});
})

//Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, validateSpotById,validateDateInputs, validateBookingDate, async(req, res) => {
    const { user } = req;
    const { startDate, endDate } = req.body;
    const spot = await Spot.findByPk(req.params.spotId);
    if(user.id === spot.ownerId){ //owner can't book spot
        unauthorizedUser();
    }
    const newBooking = await Booking.create({
        spotId: req.params.spotId,
        userId: user.id,
        startDate,
        endDate
    })
    
    res.json({newBooking})

})

//add an image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, validateSpotById, async(req, res) => {
    const spotId = req.params.spotId;
    const {url, preview} = req.body;
    const spot = await Spot.findByPk(spotId);
    const { user } = req;
    if(spot.ownerId !== user.id){
        unauthorizedUser();
    }
    let spotImg = await SpotImage.create({spotId, url, preview});
    spotImg = spotImg.toJSON();
    res.json({
        id: spotImg.id,
        url: spotImg.url,
        preview: spotImg.preview
    })
})

//Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, validateSpotById, validateReview, async(req, res) => {
    const { user } = req;
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);
    const { review, stars } = req.body;
    let currentRevs = await spot.getReviews({
        where: {
            userId: user.id
        }
    });
    currentRevs = currentRevs.map(rev => rev.toJSON());
    if(currentRevs.length){
        res.statusCode = 500
        return res.json({
            message: "User already has a review for this spot"
        })
    }
    const newReview = await Review.create({
        userId: user.id,
        spotId,
        review,
        stars
    })
    res.statusCode = 201;
    res.json({
        review: newReview.review,
        stars: newReview.stars
    })
})

//get details of a spot from an id:
router.get('/:spotId', validateSpotById, async(req, res) => {
    const spot = await Spot.findByPk(req.params.spotId, {
        include: [
            {
                model: Review,
                attributes: []
            },
            {
                model: SpotImage,
                attributes: ['id', 'url', 'preview']
            },
            {
                model: User,
                as: 'Owner',
                attributes: ['id', 'firstName', 'lastName']
            }
        ],
        attributes: {
            include: [
                [sequelize.fn('COUNT', sequelize.col('Reviews.id')), 'numReviews'],
                [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgStarRating'],
            ]
        },
        group: ['Spot.id', 'SpotImages.id', 'Owner.id']
    });
    res.json(spot);
})


//Create a spot:
router.post('/', requireAuth, validateSpot, async(req, res) => {
    const { user } = req;
    const ownerId = user.toJSON().id;
    const {address, city, state, country, lat, lng, name, description, price} = req.body;
    
    const newSpot = await Spot.create({ownerId, address, city, state, country, lat, lng, name, description, price})
    
    res.statusCode = 201;
    res.json(newSpot);
})


//Edit a spot:
router.put('/:spotId', requireAuth, validateSpotById, validateSpot, async(req, res) => {
    const spotId = req.params.spotId;
    const {address, city, state, country, lat, lng, name, description, price} = req.body;
    const { user } = req;
    const spot = await Spot.findByPk(spotId);
    if(user.id !== spot.ownerId){
        unauthorizedUser();
    }

    spot.address = address;
    spot.city = city;
    spot.state = state;
    spot.country = country;
    spot.lat = lat;
    spot.lng = lng;
    spot.name = name;
    spot.description = description;
    spot.price = price;

    await spot.save();
    res.json(spot);
})

//Delete a Spot
router.delete('/:spotId', requireAuth, validateSpotById, async(req, res) => {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);
    const { user } = req;
    if(user.id !== spot.ownerId){
        unauthorizedUser();
    }
    await spot.destroy();
    res.json({
        message: "Successfully deleted"
    })
})



module.exports = router;