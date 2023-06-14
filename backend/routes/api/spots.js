const express = require('express');
// const { Op } = require('sequelize');
// const bcrypt = require('bcryptjs');
const { Spot, Review, SpotImage, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

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
        raw: true,
        attributes: {
            //add avgRating for each spot
            include: [
                [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgRating'],
                [sequelize.col('SpotImages.url'), 'previewImage']
            ]
        },
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
        group: ['Spot.id']
    });
    res.json({spots});
})

//Get all spots owned by the current user:
router.get('/current', async(req, res) => {
    const { user } = req;
    const spots = await Spot.findAll({
        where: {
            "ownerId": user.toJSON().id
        }
    })
    res.json({spots});
    
})

//get details of a spot from an id:
router.get('/:spotId', async(req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
    if(!spot) {
        res.statusCode = 404;
        res.json({
            "message": "Spot couldn't be found"
        })
    }
    res.json(spot);
})


//Create a new spot:
router.post('/', validateSpot, async(req, res) => {
    const { user } = req;
    const ownerId = user.toJSON().id;
    const {address, city, state, country, lat, lng, name, description, price} = req.body;

    const newSpot = await Spot.create({ownerId, address, city, state, country, lat, lng, name, description, price})

    res.statusCode = 201;
    res.json(newSpot);
})


module.exports = router;