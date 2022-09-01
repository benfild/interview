const router = require('express').Router();
const { body } = require('express-validator');

// import adminController
const adminController = require('../controllers/admin.controller');
// import policeController
const policeController = require('../controllers/police.controller');
// import resultController
const resultController = require('../controllers/result.controller');
// import organizationController
const orgController = require('../controllers/organization.controller');

const { isAuthenticated, isAdmin } = require('../middlewares/auth.middleware');

// * ADMINS
// export router that register admin
router.post('/register-admin', [
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
router.get('/admins', isAuthenticated, adminController.getAdmins)

// export router that delete admin
router.delete('/delete-admin', isAuthenticated, adminController.deleteAdmin);

// * ADMINS
// export router that register teacher
router.post('/register-teacher', [
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
router.get('/teachers', isAuthenticated, adminController.getAdmins)

// export router that delete admin
router.delete('/delete-teacher', isAuthenticated, adminController.deleteAdmin);

// * REPORT PART
// export router get all results
router.get('/results', isAuthenticated, resultController.getAllResults);

// export router that delete all results
router.delete('/delete-results', isAuthenticated, resultController.deleteAllResults);

// export router that delete a result
router.delete('/delete-result', isAuthenticated, resultController.deleteResult);

// exports router
module.exports = router; 