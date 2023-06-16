const express = require('express');
const { Review, User, Spot, ReviewImage, SpotImage, sequelize } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
//import custom validations:
const { validateReview, validateReviewById, unauthorizedUser} = require('../../utils/customValidations');

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
    Reviews = Reviews.map(rev => { rev.toJSON()});
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

//Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async(req, res) => {
    const { user } = req;
    const { url } = req.body;
    const review = await Review.findByPk(req.params.reviewId);
    //must belong to user
    if(!review){
        res.statusCode = 404;
        return res.json({
            message: "Review couldn't be found"
        })
    }
    let revImages = await review.getReviewImages();
    revImages = revImages.map(rev => rev.toJSON());
    if(revImages.length >= 10){
        res.statusCode = 403;
        return res.json({
            message: "Maximum number of images for this resource was reached"
        })
    }

    const revImg = await ReviewImage.create({
        url,
        reviewId: req.params.reviewId
    })
    res.json({
        id: revImg.id,
        url: revImg.url
    })
})


module.exports = router;