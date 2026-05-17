const { body } = require('express-validator');

// username
// 3-20 chars
// letters numbers underscore only
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

// phone number
// 08123456789
// +628123456789
const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,11}$/;

// password:
// min 8
// uppercase lowercase number special char
const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;



const userRegistrationValidation = [

    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .matches(usernameRegex)
        .withMessage(
            'Username must be 3-20 characters and only contain letters, numbers, and underscore'
        ),

    body('display_name')
        .trim()
        .notEmpty().withMessage('Display name is required')
        .isLength({ max: 100 })
        .withMessage('Display name max length is 100'),

    body('phone')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .matches(phoneRegex)
        .withMessage('Invalid Indonesian phone number format'),

    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .matches(passwordRegex)
        .withMessage(
            'Password must contain uppercase, lowercase, number, and special character'
        ),
];

const validate = (req, res, next) => {

    const errors = require('express-validator').validationResult(req);

    if (!errors.isEmpty()) {

        const messages = errors.array().map(err => err.msg);

        return res.status(400).json({
            success: false,
            message: messages.join('. '),
            data: null,
        });
    }

    next();
};


module.exports = {
    userRegistrationValidation,
    validate,
};