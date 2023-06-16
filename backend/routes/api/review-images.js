const express = require('express');
const { Review, User, Spot, ReviewImage, SpotImage, sequelize } = require('../../db/models')
const { requireAuth } = require('../../utils/auth');
//import custom validations:
const { validateReview, validateReviewImageById, unauthorizedUser} = require('../../utils/customValidations');

const router = express.Router();

//Delete a Review Image
router.delete('/:imageId', requireAuth, validateReviewImageById, async(req, res) => {
    const { user } = req;
    const revImg = await ReviewImage.findByPk(req.params.imageId);
    const review = await Review.findOne({
        where: {
            id: revImg.reviewId
        }
    });
    if(user.id !== review.userId){
        unauthorizedUser();
    }
    await revImg.destroy();
    res.json({
        message: "Successfully deleted"
    })
})

module.exports = router;