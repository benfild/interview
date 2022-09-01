// import Router
const router = require('express').Router();

// import authController
const authController = require('../controllers/auth.controller');
const { body } = require('express-validator');

// export router that login user
router.post('/login', [
    body('email')
        .notEmpty()
        .withMessage('Email address is required.')
        .isEmail()
        .withMessage('Email address is invalid.')
        .normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required.')
], authController.authenticate);

// // export router that forgot password
// router.post('/forgot-password', [
//     body('email')
//         .notEmpty()
//         .withMessage('Please enter your email')
//         .isEmail()
//         .withMessage('Please enter a valid email')
//         .normalizeEmail()
// ], authController.forgotPassword);

// // export patch router that reset password
// router.patch('/reset-password', [
//     body('password').isLength({ min: 8 }).withMessage('Please enter a valid password')
// ], authController.resetPassword);

// exports router
module.exports = router;
