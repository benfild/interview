const router = require('express').Router();
const { body } = require('express-validator');

// import citizenController
const citizenController = require('../controllers/citizen.controller');
// import reportController
const reportController = require('../controllers/report.controller');

const { isAuthenticated, isCitizen, isAdmin } = require('../middlewares/auth.middleware');

// export router that register citizen
router.post('/register', [
    body('firstName')
        .notEmpty()
        .withMessage('First name is required.')
        .isLength({ min: 2 })
        .withMessage('First name must be at least 2 characters long.'),
    body('middleName')
        .notEmpty()
        .withMessage('Middle name is required.')
        .isLength({ min: 2 })
        .withMessage('Middle name must be at least 2 characters long.'),
    body('lastName')
        .notEmpty()
        .withMessage('Last name is required.')
        .isLength({ min: 2 })
        .withMessage('Last name must be at least 2 characters long.'),
    body('nida')
        .notEmpty()
        .withMessage('NIDA number is required.')
        .isNumeric()
        .withMessage('NIDA number must be a number.')
        .isLength({ min: 20, max: 20 })
        .withMessage('NIDA number must be 20 digits long.'),
    body('mobile')
        .notEmpty()
        .withMessage('Phone number is required.')
        .isNumeric()
        .withMessage('Phone number must be a number.')
        .isLength({ min: 10, max: 10 })
        .withMessage('Phone number must be 10 digits long.'),
    body('homeAddress')
        .notEmpty()
        .withMessage('Address is required.')
        .isLength({ min: 2 })
        .withMessage('Address must be at least 2 characters long.'),
    body('email')
        .notEmpty()
        .withMessage('Email address is required.')
        .isEmail()
        .withMessage('Email address is invalid.')
        .normalizeEmail(),
    body('password')
    .notEmpty()
    .withMessage('Password is required.')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.')
], citizenController.register);

// export router that update report by id
router.put('/update', [
    body('userId')
        .notEmpty()
        .withMessage('User ID is required.'),
    body('firstName')
        .notEmpty()
        .withMessage('First name is required.'),
    body('lastName')
        .notEmpty()
        .withMessage('Last name is required.'),
    body('age')
        .notEmpty()
        .withMessage('Age is required')
        .isNumeric()
        .withMessage('Age must be a number.'),
    body('gender')
        .notEmpty()
        .withMessage('Gender is required.'),
    body('reason')
        .notEmpty()
        .withMessage('Reason is required.'),
    body('health')
        .notEmpty()
        .withMessage('Health is required.'),
    body('homeAddress')
        .notEmpty()
        .withMessage('Home address is required.'),
    body('lastLocation')
        .notEmpty()
        .withMessage('Last location is required.'),
    body('description')
        .notEmpty()
        .withMessage('Description is required.'),
], isAuthenticated, isCitizen, reportController.updateReport);

// export router that get all citizen
router.get('/citizens', isAuthenticated, isAdmin, citizenController.getCitizens);

// export router that delete citizen by id
router.delete('/delete-citizen', isAuthenticated, isAdmin, citizenController.deleteCitizen);


// exports router
module.exports = router; 