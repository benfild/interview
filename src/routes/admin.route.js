const router = require('express').Router();
const { body } = require('express-validator');

// import adminController
const adminController = require('../controllers/admin.controller');
// import policeController
const policeController = require('../controllers/police.controller');
// import reportController
const reportController = require('../controllers/report.controller');
// import organizationController
const orgController = require('../controllers/organization.controller');

const { isAuthenticated, isAdmin } = require('../middlewares/auth.middleware');

// * ADMINS
// export router that register admin
router.post('/register', [
    body('fullName')
        .notEmpty()
        .withMessage('Full name is required.')
        .isLength({ min: 8 })
        .withMessage('Full name must be at least 8 characters long.'),
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
], isAuthenticated, isAdmin, adminController.register);

// export router get all admins
router.get('/admins', isAuthenticated, isAdmin, adminController.getAdmins)

// export router that delete admin
router.delete('/delete-admin', isAuthenticated, isAdmin, adminController.deleteAdmin);

// * POLICE PART
// export router that register police_station
router.post('/register-police-station', [
    body('station_name')
        .notEmpty()
        .withMessage('Name is required.')
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters long.'),
    body('address')
        .notEmpty()
        .withMessage('Address is required.')
        .isLength({ min: 2 })
        .withMessage('Address must be at least 2 characters long.'),
    body('mobile')
        .notEmpty()
        .withMessage('Phone number is required.')
        .isNumeric()
        .withMessage('Phone number must be a number.')
        .isLength({ min: 10, max: 10 })
        .withMessage('Phone number must be 10 digits long.')
], isAuthenticated, isAdmin, policeController.register_station);

// export router that registered police to the station
router.post('/register-police', [
    body('fullName')
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
    body('mobile')
        .notEmpty()
        .withMessage('Phone number is required.')
        .isNumeric()
        .withMessage('Phone number must be a number.')
        .isLength({ min: 10, max: 10 })
        .withMessage('Phone number must be 10 digits long.'),
    body('password')
        .notEmpty()
        .withMessage('Password is required.')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long.')
], isAuthenticated, isAdmin, policeController.register_police);

// export router get all police_stations
router.get('/police-stations', isAuthenticated, isAdmin, policeController.get_all_police_stations);

// export router get a police_stations
router.get('/police-station', isAuthenticated, isAdmin, policeController.get_police_station);

// export router delete a police_station
router.delete('/delete-police-station', isAuthenticated, isAdmin, policeController.delete_police_station);

// export router that delete police
router.delete('/delete-police', isAuthenticated, isAdmin, policeController.delete_police);

// * ORGANIZATION PART
// export router that register organization
router.post('/register-organization', [
    body('organization_name')
    .notEmpty()
    .withMessage('Name is required.')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long.'),
    body('address')
        .notEmpty()
        .withMessage('Address is required.')
        .isLength({ min: 2 })
        .withMessage('Address must be at least 2 characters long.'),
    body('type')
        .notEmpty()
        .withMessage('Organization type is required.')
        .isLength({ min: 2 })
        .withMessage('Organization type must be at least 2 characters long.'),
    body('mobile')
        .notEmpty()
        .withMessage('Phone number is required.')
        .isNumeric()
        .withMessage('Phone number must be a number.')
        .isLength({ min: 10, max: 10 })
        .withMessage('Phone number must be 10 digits long.')
], isAuthenticated, isAdmin, orgController.register_org);

// export router that register user to the organization
router.post('/register-org_user', [
    body('fullName')
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
        .withMessage('Password must be at least 8 characters long.'),
    body('mobile')
        .notEmpty()
        .withMessage('Phone number is required.')
        .isNumeric()
        .withMessage('Phone number must be a number.')
        .isLength({ min: 10, max: 10 })
        .withMessage('Phone number must be 10 digits long.')
], isAuthenticated, isAdmin, orgController.register_orgUser);

// export router get all organizations
router.get('/organizations', isAuthenticated, isAdmin, orgController.get_orgs);

// export router get a organization
router.get('/organization', isAuthenticated, isAdmin, orgController.get_org);

// export router that deletes organization
router.delete('/delete-organization', isAuthenticated, isAdmin, orgController.delete_org);

// export router that deletes organization user
router.delete('/delete-org_user', isAuthenticated, isAdmin, orgController.delete_orgUser);

// * REPORT PART
// export router get all reports
router.get('/reports', isAuthenticated, isAdmin, reportController.getAllReports);

// export router that delete all reports
router.delete('/delete-reports', isAuthenticated, isAdmin, reportController.deleteAllReports);

// export router that delete a report
router.delete('/delete-report', isAuthenticated, isAdmin, reportController.deleteReport);

// exports router
module.exports = router; 