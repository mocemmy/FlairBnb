const express = require('express');
const { Review, User, Spot, ReviewImage, SpotImage, sequelize } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

module.exports = router;