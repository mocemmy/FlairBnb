const express = require('express');
const { Review, User, Spot, ReviewImage, SpotImage, sequelize } = require('../../db/models')
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
    
    Reviews = Reviews.map(rev => rev.toJSON());
    Reviews.forEach(rev => {
        console.log('here ----------',rev.Spot)
        rev.Spot.previewImage = rev.Spot.SpotImages[0].url
        delete rev.Spot.SpotImages
    });
    res.json({Reviews});
})


//Edit a Review
router.put('/:reviewId', requireAuth, validateReviewById, validateReview, async(req, res) => {
    const { user } = req;
    const reviewId = req.params.reviewId;
    const rev = await Review.findByPk(reviewId);
    const { review, stars } = req.body;
    if(user.id !== rev.userId){
        unauthorizedUser();
    }
    rev.review = review;
    rev.stars = stars;
    await rev.save();
    res.json(rev)
})

//Delete a review
router.delete('/:reviewId', requireAuth, validateReviewById, async(req, res) => {
    const { user } = req;
    const review = await Review.findByPk(req.params.reviewId);
    if(user.id !== review.userId){
        unauthorizedUser();
    }
    await review.destroy();
    res.json({
        message: "Successfully deleted"
    })
})

//Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, validateReviewById, async(req, res) => {
    const { user } = req;
    const { url } = req.body;
    const review = await Review.findByPk(req.params.reviewId);
    let revImages = await review.getReviewImages();
    revImages = revImages.map(rev => rev.toJSON());
    if(user.id !== review.userId){
        unauthorizedUser();
    }
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