const express = require('express');
// const { Op } = require('sequelize');
// const bcrypt = require('bcryptjs');
const { Spot, Review, SpotImage, sequelize } = require('../../db/models');

const router = express.Router();



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


module.exports = router;