const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation.js');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const { Spot } = require('../../db/models');

//GET all spots:
router.get('/', async(req, res) => {
    const spots = await Spot.findAll();

    res.json({spots});
})


module.exports = router;