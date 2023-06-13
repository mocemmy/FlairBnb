const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { User, Spot, Review, SpotImage, sequelize, Sequelize } = require('../../db/models');

const router = express.Router();



//GET all spots:
router.get('/', async(req, res) => {
    //find all spots
    const spots = await Spot.findAll({
        raw: true,
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
                [sequelize.col('previewImage.url'), 'previewImage']
            ]
        },
        group: ['Spot.id']
    });

 



    res.json({spots});
})


module.exports = router;