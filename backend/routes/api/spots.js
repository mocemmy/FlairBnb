const express = require('express');
const { Op } = require('sequelize');
// const bcrypt = require('bcryptjs');
const { Spot, Review, SpotImage, User, Booking, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { validationResult } = require('express-validator');

const router = express.Router();

const handleDateValidation = (req, _res, next) => {
    const validationErrors = validationResult(req);

    if(!validationErrors.isEmpty()) {
        const errors = {};
        validationErrors
            .array()
            .forEach(error => errors[error.path] = error.msg);
    
        const err = Error("Sorry, this spot is already booked for the specified dates");
        err.errors = errors;
        err.status = 403;
        err.title = 'Bad request.';
        next(err);
    }
    next();
}

const validateSpot = [
    check('address')
        .exists({ checkFalsey: true })
        .notEmpty()
        .withMessage("Street address is required"),
    check('city')
        .exists({ checkFalsey: true })
        .notEmpty()
        .withMessage("City is required"),
    check('state')
        .exists({ checkFalsey: true })
        .notEmpty()
        .withMessage("State is required"),
    check('country')
        .exists({ checkFalsey: true })
        .notEmpty()
        .withMessage("Country is required"),
    check('lat')
        .exists({ checkFalsey: true })
        .notEmpty()
        .isNumeric({min: -90, max: 90})
        .withMessage("Latitude is not valid"),
    check('lng')
        .exists({ checkFalsey: true })
        .notEmpty()
        .isNumeric({min: -180, max: 180})
        .withMessage("Longitude is not valid"),
    check('name')
        .exists({ checkFalsey: true })
        .notEmpty()
        .isLength({max: 50})
        .withMessage("Name must be less than 50 characters"),
    check('description')
        .exists({ checkFalsey: true })
        .notEmpty()
        .withMessage("Description is required"),
    check('price')
        .exists({ checkFalsey: true })
        .notEmpty()
        .withMessage("Price per day is required"),
    handleValidationErrors
]

const validateReview = [
    check('review')
        .exists({ checkFalsey: true })
        .notEmpty()
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsey: true })
        .notEmpty()
        .isInt({min: 1, max: 5})
        .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
]


const validateDateInputs = [
    check('endDate').custom((value, { req }) => {
        if(value < req.body.startDate){
            throw new Error("endDate cannot be on or before startDate")
        }
        return true
    }),
    handleValidationErrors
]

const validateBookingDate = [
    check('startDate').custom(async (value, { req }) => {
        let bookings = await Booking.findAll({
            where: {
                spotId: req.params.spotId,
            },
            attributes: ['startDate', 'endDate']
        })
        bookings = bookings.map(booking => booking.toJSON());
        let conflicts;
        for(let i = 0; i < bookings.length; i++){
            let el = bookings[i];
            if(value >= el.startDate && value <= el.endDate){
                conflicts = true;
                break;
            }
        }
        if(conflicts){
            throw new Error("Start date conflicts with an existing booking")
        }
        return true
    }),
    check('endDate').custom(async (value, { req }) => {
        let bookings = await Booking.findAll({
            where: {
                spotId: req.params.spotId,
            },
            attributes: ['startDate', 'endDate']
        })
        bookings = bookings.map(booking => booking.toJSON());
        let conflicts;
        for(let i = 0; i < bookings.length; i++){
            let el = bookings[i];
            if(value >= el.startDate && value <= el.endDate){
                conflicts = true;
                break;
            }
        }
        if(conflicts){
            throw new Error("End date conflicts with an existing booking")
        }
        return true
    }),
    check('startDate').custom(async (value, { req }) => {
        const end = req.body.endDate;
        let bookings = await Booking.findAll({
            where: {
                spotId: req.params.spotId
            },
            attributes: ['startDate', 'endDate']
        })
        bookings = bookings.map(booking => booking.toJSON());
        let conficts;
        for(let i = 0; i < bookings.length; i++){
            let el = bookings[i];
            if(value < el.startDate && end > el.endDate){
                conficts = true;
                break;
            }
        }

        if(conficts){
            throw new Error("Spot unavailable for some time between startDate and endDate")
        }
        return true
    }),
    handleDateValidation
]


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
router.get('/:spotId/bookings', requireAuth, async(req, res) => {
    const { user } = req;
    const spot = await Spot.findByPk(req.params.spotId);
    if(!spot){
        res.statusCode = 404;
        return res.json({
            message: "Spot couldn't be found"
        })
    }
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
router.get('/:spotId/reviews', async(req, res) => {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);

    if(!spot){
        res.statusCode = 404;
        return res.json({
            message: "Spot couldn't be found"
        })
    }

    const Reviews = await Review.findAll({
        where: {
            spotId: spotId
        }
    })

    res.json({Reviews});
})
//Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, validateDateInputs, validateBookingDate, async(req, res) => {
    const { user } = req;
    const { startDate, endDate } = req.body;
    const spot = await Spot.findByPk(req.params.spotId);
    if(user.id === spot.ownerId){ //owner can't book spot
        res.statusCode = 403;
        return res.json({
            message: "Forbidden"
        })
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
router.post('/:spotId/images', requireAuth, async(req, res) => {
    const spotId = req.params.spotId;
    const {url, preview} = req.body;
    const spot = await Spot.findByPk(spotId);
    const { user } = req;
    if(!spot){
        res.statusCode = 404;
        return res.json({
            "message": "Spot couldn't be found"
        })
    }
    //require proper authorization
    if(spot.ownerId !== user.id){
        res.statusCode = 403
        res.json({
            message: "Forbidden"
        })
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
router.post('/:spotId/reviews', requireAuth, validateReview, async(req, res) => {
    const { user } = req;
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);
    const { review, stars } = req.body;
    if(!spot){
        res.statusCode = 404
        return res.json({
            message: "Spot couldn't be found"
        })
    }
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
router.get('/:spotId', async(req, res) => {
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
    if(!spot) {
        res.statusCode = 404;
        res.json({
            "message": "Spot couldn't be found"
        })
    }
    res.json(spot);
})


//Create a new spot:
router.post('/', requireAuth, validateSpot, async(req, res) => {
    const { user } = req;
    const ownerId = user.toJSON().id;
    const {address, city, state, country, lat, lng, name, description, price} = req.body;
    
    const newSpot = await Spot.create({ownerId, address, city, state, country, lat, lng, name, description, price})
    
    res.statusCode = 201;
    res.json(newSpot);
})


//Edit a spot:
router.put('/:spotId', requireAuth, validateSpot, async(req, res) => {
    const spotId = req.params.spotId;
    const {address, city, state, country, lat, lng, name, description, price} = req.body;
    const { user } = req;
    
    const spot = await Spot.findByPk(spotId);
    if(!spot){
        res.statusCode = 404
        return res.json({
            message: "Spot couldn't be found"
        })
    }
    
    if(user.id !== spot.ownerId){
        res.statusCode = 403
        return res.json({
            message: "Forbidden"
        })
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
router.delete('/:spotId', requireAuth, async(req, res) => {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);
    const { user } = req;
    if(!spot){
        res.statusCode = 404;
        return res.json({
            message: "Spot couldn't be found"
        })
    }
    if(user.id !== spot.ownerId){
        res.statusCode = 403;
        return res.json({
            message: "Forbidden"
        })
    }
    await spot.destroy();
    res.json({
        message: "Successfully deleted"
    })
})



module.exports = router;