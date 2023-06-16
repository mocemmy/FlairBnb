const express = require('express');
const { Op } = require('sequelize');
// const bcrypt = require('bcryptjs');
const { Spot, Review, SpotImage, User, Booking, ReviewImage,sequelize } = require('../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('./validation');
const { requireAuth } = require('./auth');
const { validationResult } = require('express-validator');

function handleDateValidation (req, _res, next){
    const validationErrors = validationResult(req);

    if(!validationErrors.isEmpty()) {
        const errors = {};
        validationErrors
            .array()
            .forEach(error => errors[error.path] = error.msg);
    
        const err = Error("Sorry, this spot is already booked for the specified dates");
        err.errors = errors;
        err.status = 403;
        err.title = 'Bad request.';
        next(err);
    }
    next();
}

const validateSignup = [
    check('firstName')
        .exists({ checkFalsey: true })
        .isLength({ min: 2})
        .withMessage('Please provide a first name with at least 2 characters.'),
    check('lastName')
        .exists({ checkFalsey: true })
        .isLength({ min: 2})
        .withMessage('Please provide a last name with at least 2 characters.'),
    check('email')
        .exists({checkFalsey: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsey: true })
        .isLength({ min: 4})
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('password')
        .exists({ checkFalsey: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];

function checkConflicts (bookingsArr, date) {
    let conflicts;
    for(let i = 0; i < bookingsArr.length; i++){
        const el = bookingsArr[i];
        if(date >= el.startDate && date <= el.endDate){
            conflicts = true;
            break;
        }
    }
    return conflicts;
}

function checkConflictsInner (bookingsArr, date, end) {
    let conflicts;
    for(let i = 0; i < bookingsArr.length; i++){
        const el = bookingsArr[i];
        if(date < el.startDate && end > el.endDate){
            conflicts = true;
            break;
        }
    }
    return conflicts;
}

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

 validateReview = [
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


 const validateDateInputs = [
    check('endDate').custom((value, { req }) => {
        if(value < req.body.startDate){
            throw new Error("endDate cannot be on or before startDate")
        }
        return true
    }),
    handleValidationErrors
]
const validateBookingDateByBookingId = [
    check('startDate').custom(async (value, { req }) => {
        const oldBooking = await Booking.findByPk(req.params.bookingId);
        let bookings = await Booking.findAll({
            where: {
                spotId: oldBooking.spotId,
            },
            attributes: ['startDate', 'endDate']
        })
        bookings = bookings.map(booking => booking.toJSON());
        let conflicts = checkConflicts(bookings, value);
        if(conflicts){
            throw new Error("Start date conflicts with an existing booking")
        }
        return true
    }),
    check('endDate').custom(async (value, { req }) => {
        const oldBooking = await Booking.findByPk(req.params.bookingId);
        let bookings = await Booking.findAll({
            where: {
                spotId: oldBooking.spotId,
            },
            attributes: ['startDate', 'endDate']
        })
        bookings = bookings.map(booking => booking.toJSON());
        let conflicts = checkConflicts(bookings, value);
        if(conflicts){
            throw new Error("End date conflicts with an existing booking")
        }
        return true
    }),
    check('startDate').custom(async (value, { req }) => {
        const oldBooking = await Booking.findByPk(req.params.bookingId);
        const end = req.body.endDate;
        let bookings = await Booking.findAll({
            where: {
                spotId: oldBooking.spotId
            },
            attributes: ['startDate', 'endDate']
        })
        bookings = bookings.map(booking => booking.toJSON());
        let conficts = checkConflictsInner(bookings, value, end);
        if(conficts){
            throw new Error("Spot unavailable for some time between startDate and endDate")
        }
        return true
    }),
    handleDateValidation
]

 const validateBookingDate = [
    check('startDate').custom(async (value, { req }) => {
        let bookings = await Booking.findAll({
            where: {
                spotId: req.params.spotId,
            },
            attributes: ['startDate', 'endDate']
        })
        bookings = bookings.map(booking => booking.toJSON());
        let conflicts = checkConflicts(bookings, value);
        if(conflicts){
            throw new Error("Start date conflicts with an existing booking")
        }
        return true
    }),
    check('endDate').custom(async (value, { req }) => {
        let bookings = await Booking.findAll({
            where: {
                spotId: req.params.spotId,
            },
            attributes: ['startDate', 'endDate']
        })
        bookings = bookings.map(booking => booking.toJSON());
        let conflicts = checkConflicts(bookings, value);
        if(conflicts){
            throw new Error("End date conflicts with an existing booking")
        }
        return true
    }),
    check('startDate').custom(async (value, { req }) => {
        const end = req.body.endDate;
        let bookings = await Booking.findAll({
            where: {
                spotId: req.params.spotId
            },
            attributes: ['startDate', 'endDate']
        })
        bookings = bookings.map(booking => booking.toJSON());
        let conficts = checkConflictsInner(bookings, value, end);
        if(conficts){
            throw new Error("Spot unavailable for some time between startDate and endDate")
        }
        return true
    }),
    handleDateValidation
]

const validateBookingById = async function (req, res, next) {
    const bookingId = req.params.bookingId;
    const booking = await Booking.findByPk(bookingId);
    if(!booking) {
        const err = new Error("Booking couldn't be found");
        err.status = 404;
        return next(err);
    }
    return next();
}

const validateSpotById = async function (req, res, next) {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);
    if(!spot){
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    }
    return next();
}

const validateReviewById = async function (req, res, next) {
    const reviewId = req.params.reviewId;
    const review = await Review.findByPk(reviewId);
    if(!review){
        const err = new Error("Review couldn't be found");
        err.status = 404;
        return next(err)
    }
    return next();
}

const validateReviewImageById = async function (req, res, next) {
    const imageId = req.params.imageId;
    const reviewImage = await ReviewImage.findByPk(imageId);
    if(!reviewImage) {
        const err = new Error("Review Image couldn't be found");
        err.status = 404;
        return next(err);
    }
    return next();
}

const unauthorizedUser = function (){
    const err = new Error("Forbidden");
    err.status = 403;
    throw err;
}


module.exports = {
    handleDateValidation,
    validateSignup,
    validateSpot,
    validateReview,
    validateDateInputs,
    validateBookingDate,
    validateBookingDateByBookingId,
    validateBookingById,
    validateSpotById,
    validateReviewById,
    validateReviewImageById,
    unauthorizedUser
}