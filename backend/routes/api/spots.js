const express = require('express');
const { Op } = require('sequelize');
// const bcrypt = require('bcryptjs');
const { Spot, Review, ReviewImage, SpotImage, User, Booking, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { validationResult } = require('express-validator');
//import customValidations
const { handleDateValidation, validateSpot, validateReview, validateDateInputs, validateBookingDate, validateSpotById, unauthorizedUser, validateSearchParams, validateSpotImageById} = require('../../utils/customValidations');
const paginationFunc = require('../../utils/pagination')

const router = express.Router();




//GET all spots:
router.get('/', validateSearchParams, async(req, res) => {
    //find all spots
    const pagination = paginationFunc(req.query);
    let {page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query;
    let where = {};
//search query calculations:
    if(!isNaN(minLat)) where.lat = {[Op.gte]: +minLat}
    if(!isNaN(maxLat)) where.lat = {[Op.lte]: +maxLat}
    if(!isNaN(minLat) && !isNaN(maxLat)) {
        where.lat = {
            [Op.gte]: +minLat,
            [Op.lte]: +maxLat
        }
    }
    if(!isNaN(minLng)) where.lng = {[Op.gte]: +minLng}
    if(!isNaN(maxLng)) where.lng = {[Op.lte]: +maxLng}
    if(!isNaN(minLng) && !isNaN(maxLng)) {
        where.lng = {
            [Op.gte]: +minLng,
            [Op.lte]: +maxLng
        }
    }
    if(!isNaN(minPrice)) where.Price = {[Op.gte]: +minPrice}
    if(!isNaN(maxPrice)) where.lng = {[Op.lte]: +maxPrice}
    if(!isNaN(minPrice) && !isNaN(maxPrice)) {
        where.Price = {
            [Op.gte]: +minPrice,
            [Op.lte]: +maxPrice
        }
    }

    let Spots = await Spot.findAll({
        where,
       include: [
        {
            model: Review,
            attributes: ['stars']
        },
        {
            model: SpotImage,
            attributes: ['url']
        }],
        ...pagination,
    });
    Spots = Spots.map(spot => spot.toJSON());
    Spots.forEach(spot => {
        if(spot.Reviews.length){
            spot.avgRating = spot.Reviews.reduce((acc, curr) => acc + curr.stars, 0)/ spot.Reviews.length;
        } else spot.avgRating = null;
        delete spot.Reviews;
        if(spot.SpotImages.length){
            spot.previewImage = spot.SpotImages[0].url;
        } else spot.previewImage = null;
        delete spot.SpotImages;
    })

    
    
    page = +page || 1;
    size = +size || 20;
    res.json({
        Spots,
        page,
        size
    });
})

//Get all spots owned by the current user:
router.get('/current', requireAuth, async(req, res) => {
    const { user } = req;
    const Spots = await Spot.findAll({
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
    res.json({Spots});
    
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
        },
        include: [{
            model: User,
            attributes: ['id', 'firstName', 'lastName']},
            {
                model: ReviewImage,
                attributes: ['id', 'url']

            }
        ]
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
    
    res.json(newBooking)

})


//add multiple images to a spot based on the Spot's id
router.post('/:spotId/images', requireAuth, validateSpotById, async(req, res) => {
    const spotId = req.params.spotId;
    const {images} = req.body;
    images.forEach(image => image.spotId = spotId);
    const spot = await Spot.findByPk(spotId);
    const { user } = req;
    if(spot.ownerId !== user.id) {
        unauthorizedUser();
    }
    
    let spotImages = await SpotImage.bulkCreate(images);
    spotImages = spotImages.map(img => img.toJSON())
    res.json(spotImages)
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
    res.json(newReview);
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

//update all images for a spot
router.patch('/:spotId/images/edit', requireAuth, validateSpotById, async(req, res) => {
    const spotId = req.params.spotId;
    //get all images for spot;
    const oldImages = await SpotImage.findAll({
        where: {
            spotId,
        }
    });
    for(let image of oldImages) { //destroy images
        await image.destroy();
    } 

    const images = req.body;
    images.images.forEach(image => image.spotId = spotId);
    const spot = await Spot.findByPk(spotId);
    const { user } = req;
    if(spot.ownerId !== user.id) {
        unauthorizedUser();
    }
    let spotImages = await SpotImage.bulkCreate(images.images);
    spotImages = spotImages.map(img => img.toJSON())
    res.json(spotImages)
    
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