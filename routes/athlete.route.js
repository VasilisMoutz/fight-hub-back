const router = require('express').Router();
const athleteController = require('../controllers/athlete.controller');
const { validationResult, body } = require('express-validator');

// Validate Proper Credentials Format
const credentialsFormatValidator = () => {
    return [
        body('email').not().isEmpty().withMessage('Email is required field'),
        body('email').isEmail().withMessage('Email incorrect format'),
        body('password').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
        .withMessage('Password incorrect format')
    ]
}

// Sign up
router.post('/signup', credentialsFormatValidator(), (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({
            status: false,
            data: errors.array()
        });
    }
    next()
}, athleteController.signup);

// Login
router.post('/login', athleteController.login)

// Logout
router.post('/logout', athleteController.logout)

// Register to an event
router.post('/event-register', athleteController.eventRegister)

// Authentication
router.get('/auth', athleteController.checkAuth)

// Return all athletes
router.get('/', athleteController.findAll)




module.exports = router;