const express = require('express')
const bcrypt = require('bcryptjs');
//backend/routes/api/users.js
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

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

const router = express.Router();

router.post('/', validateSignup, async (req, res) => {
    const { firstName, lastName, email, password, username } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({firstName, lastName, email, username, hashedPassword});

    const safeUser  = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username
    };

    await setTokenCookie(res, safeUser);
    return res.json({
        user: safeUser
    });
});

module.exports = router;