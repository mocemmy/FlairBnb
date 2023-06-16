const express = require('express');
const { Review, User, Spot, ReviewImage, SpotImage, sequelize } = require('../../db/models')
const { requireAuth } = require('../../utils/auth');
//import custom validations:
const { validateSpotImageById, unauthorizedUser} = require('../../utils/customValidations');

const router = express.Router();

//Delete a Spot Image
router.delete('/:imageId', requireAuth, validateSpotImageById, async(req, res) => {
    const { user } = req;
    const spotImg = await SpotImage.findByPk(req.params.imageId);
    const spot = await Spot.findOne({
        where: {
            id: spotImg.spotId
        }
    });
    if(user.id !== spot.ownerId){
        unauthorizedUser();
    }
    await spotImg.destroy();
    res.json({
        message: "Successfully deleted"
    })
})

module.exports = router;