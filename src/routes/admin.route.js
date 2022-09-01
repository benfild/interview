const router = require('express').Router();
const { body } = require('express-validator');

// import adminController
const adminController = require('../controllers/admin.controller');

const { isAuthenticated } = require('../middlewares/auth.middleware');

// * USER
// export router that register teacher
router.post('/register', [
    body('name')
        .notEmpty()
        .withMessage('Full name is required.')
        .isLength({ min: 8 })
        .withMessage('Full name must be at least 8 characters long.'),
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
], isAuthenticated, adminController.register);

// export router get all admins
router.get('/users', isAuthenticated, adminController.getUsers)

// export router that delete admin
router.delete('/delete-user', isAuthenticated, adminController.deleteUser);

// exports router
module.exports = router; 