const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation.js');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User, Review, SpotImage, sequelize, Sequelize } = require('../../db/models');

const router = express.Router();

const { Spot } = require('../../db/models');

//GET all spots:
router.get('/', async(req, res) => {
    //find all spots
    const spots = await Spot.findAll({
        include: [
            {
                model: Review,
                as: 'ratings',
                attributes: []
            },
            {
                //add previewImage for each spot
                model: SpotImage,
                as: 'previewImage',
                attributes: []
            }
        ],
        attributes: {
            //add avgRating for each spot
            include: [
                [sequelize.fn('AVG', sequelize.col('ratings.stars')), 'avgRating'],
            ]
        },
        group: ['Spot.id']
    });

 



    res.json({spots});
})


module.exports = router;