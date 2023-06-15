const express = require('express');
const { Review, User, Spot, ReviewImage, SpotImage, sequelize } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

//Get all Reviews of the Current User
router.get('/current', requireAuth, async(req, res) => {
    const { user } = req;
    let Reviews = await Review.findAll({
        where: {
            userId: user.id
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                // raw: true,
                model: Spot,
                attributes: {
                    exclude: ['updatedAt', 'createdAt'],
                },
                include: [
                    {
                        model: SpotImage,
                        as: 'previewImage',
                        attributes: ['url']
                    }
                ]
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ],
        
    })
    Reviews = Reviews.map(rev => {
        // console.log(rev.toJSON().Spot.previewImage[0].url)
        return rev.toJSON();
    });

    Reviews.forEach(rev => {
        rev.Spot.previewImage = rev.Spot.previewImage[0].url
    });


    res.json({Reviews});
})



module.exports = router;