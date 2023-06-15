const express = require('express');
const { Review, User, Spot, ReviewImage, SpotImage, sequelize } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

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
        rev.Spot.previewImage = rev.Spot.SpotImages[0].url
        delete rev.Spot.SpotImages
    });


    res.json({Reviews});
})


//Edit a Review
router.put('/:reviewId', requireAuth, validateReview, async(req, res) => {
    const { user } = req;
    const reviewId = req.params.reviewId;
    const rev = await Review.findByPk(reviewId);
    const { review, stars } = req.body;
    if(!rev){
        res.statusCode = 404;
        return res.json({
            message: "Review couldn't be found"
        })
    }
    if(user.id !== rev.userId){
        res.statusCode = 403;
        return res.json({
            message: "Forbidden"
        })
    }

    rev.review = review;
    rev.stars = stars;
    await rev.save();

    res.json(rev)

})

//Delete a review
router.delete('/:reviewId', requireAuth, async(req, res) => {
    const { user } = req;
    const review = await Review.findByPk(req.params.reviewId);
    if(!review){
        res.statusCode = 404;
        return res.json({
            message: "Review couldn't be found"
        })
    }
    if(user.id !== review.userId){
        res.statusCode = 403;
        return res.json({
            message: "Forbidden"
        })
    }

    await review.destroy();
    res.json({
        message: "Successfully deleted"
    })
})


module.exports = router;