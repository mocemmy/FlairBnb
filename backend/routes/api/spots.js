const express = require('express');
// const { Op } = require('sequelize');
// const bcrypt = require('bcryptjs');
const { Spot, Review, SpotImage, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
<<<<<<< HEAD
=======
const { requireAuth } = require('../../utils/auth');
>>>>>>> dev

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
<<<<<<< HEAD

=======
>>>>>>> dev


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
<<<<<<< HEAD
router.get('/current', async(req, res) => {
=======
router.get('/current', requireAuth, async(req, res) => {
>>>>>>> dev
    const { user } = req;
    const spots = await Spot.findAll({
        where: {
            "ownerId": user.toJSON().id
        }
    })
    res.json({spots});
    
})
<<<<<<< HEAD
=======
//add an image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, async(req, res) => {
    const spotId = req.params.spotId;
    const {url, preview} = req.body;
    const spot = await Spot.findByPk(spotId);
    if(!spot){
        res.statusCode = 404;
        return res.json({
            "message": "Spot couldn't be found"
        })
    }

    let spotImg = await SpotImage.create({spotId, url, preview});
    spotImg = spotImg.toJSON();
    res.json({
        url: spotImg.url,
        preview: spotImg.preview
    })
})
>>>>>>> dev

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
<<<<<<< HEAD
router.post('/', validateSpot, async(req, res) => {
=======
router.post('/', requireAuth, validateSpot, async(req, res) => {
>>>>>>> dev
    const { user } = req;
    const ownerId = user.toJSON().id;
    const {address, city, state, country, lat, lng, name, description, price} = req.body;

    const newSpot = await Spot.create({ownerId, address, city, state, country, lat, lng, name, description, price})

    res.statusCode = 201;
    res.json(newSpot);
})

<<<<<<< HEAD
=======
//Edit a spot:
router.put('/:spotId', validateSpot, async(req, res) => {
    const spotId = req.params.spotId;
    const {address, city, state, country, lat, lng, name, description, price} = req.body;
    const { user } = req;
    
    const spot = await Spot.findByPk(spotId);
    if(user.is !== spot.ownerId){
        res.status = 401
        return res.json({
            message: "Spot must belong to the current user"
        })
    }
    if(!spot){
        res.statusCode = 404
        return res.json({
            message: "Spot couldn't be found"
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

>>>>>>> dev

module.exports = router;