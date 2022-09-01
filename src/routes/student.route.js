const router = require('express').Router();
const { body } = require('express-validator');

// import studentController
const studentController = require('../controllers/student.controller');
// import resultController
const resultController = require('../controllers/result.controller');

const { isAuthenticated, isTeacher, isAdmin } = require('../middlewares/auth.middleware');

// export router that register student
router.post('/register', [
    body('name')
        .notEmpty()
        .withMessage('Name is required.')
        .isLength({ min: 8 })
        .withMessage('Full name is required.'),
], studentController.register);


// export router that get all student
router.get('/students', isAuthenticated,  studentController.getAllStudents);

// export router that delete student by id
router.delete('/delete-student', isAuthenticated,  studentController.deleteStudent);


// exports router
module.exports = router; 