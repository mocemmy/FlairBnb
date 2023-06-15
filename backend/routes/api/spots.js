const express = require('express');
// const { Op } = require('sequelize');
// const bcrypt = require('bcryptjs');
const { Spot, Review, SpotImage, User, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

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