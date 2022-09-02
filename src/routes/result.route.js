const router = require('express').Router();
const { body } = require('express-validator');

// import resultController
const resultController = require('../controllers/result.controller');

const { isAuthenticated, isTeacher, isAdmin } = require('../middlewares/auth.middleware');

// export router that register student
router.post('/add', [
    body('mathematics')
        .notEmpty()
        .isNumeric()
        .withMessage('Mathematics is required.'),
    body('english')
        .notEmpty()
        .isNumeric()
        .withMessage('English is required.'), 
    body('physics')
        .notEmpty()
        .isNumeric()
        .withMessage('Physics is required.'),
    body('chemistry')
        .notEmpty()
        .isNumeric()
        .withMessage('Chemistry is required.'),
    body('biology')
        .notEmpty()
        .isNumeric()
        .withMessage('Biology is required.'),
], isAuthenticated, resultController.addResult);

// export router that update result by id
router.put('/update', [
    body('mathematics')
        .notEmpty()
        .withMessage('Mathematics is required.'),
    body('english')
        .notEmpty()
        .withMessage('English is required.'),
    body('physics')
        .notEmpty()
        .withMessage('Physics is required.'),
    body('chemistry')
        .notEmpty()
        .withMessage('Chemistry is required.'),
    body('biology')
        .notEmpty()
        .withMessage('Biology is required.'),
], isAuthenticated, resultController.updateResult);

// export router that get all student
router.get('/results', isAuthenticated,  resultController.getAllResults);

// export router that delete student by id
router.delete('/delete-result', isAuthenticated,  resultController.deleteResult);

// export router that delete all results
// router.delete('/delete-results', isAuthenticated, resultController.deleteAllResults);


// exports router
module.exports = router; 