const { validationResult } = require('express-validator');

// helpers variables
const { throwError, checkErrorStatus } = require('../helpers/handler');
const { POLICE_STATUS, REPORT_STATUS } = require('../helpers/constants');

// import student model and user model
const Student = require('../models/student.model');


// exports create function that creates a new student
exports.register = async (req, res, next) => {
    // get the user id from the request body
    const { name } = req.body;

    try {
        // get the validation errors
        const errors = validationResult(req);

        // check if there are errors
        if (!errors.isEmpty()) {
            // throw error
            throwError('Invalid student fields', 422, errors.array());
        }

        // get the student
        const existStudent = await Student.findOne({name: name});

        // check if the student exists
        if (existStudent) {
            // throw error
            throwError('That person already exists in the system!!', 422);
        }

        const reporter = { id: req.user._id, username: req.user.username };
        // create the student
        const student = new Student({
            name
        });

        // save the student
        await student.save();

        // return all students
        const students = await Student.find().populate('results');
        // send the student
        res.status(200).json({
            status: 200,
            message: 'Student registered successfully!',
            data: {students},
        });
    } catch (error) {
        checkErrorStatus(error);
        next(error);
    }
}

// exports function that gets all the students
exports.getAllStudents = async (req, res, next) => {
    try {
        // get all the students
        const students = await Student.find().populate('results');
        console.log("Students fetched")
        // send the students
        res.status(200).json({
            status: 200,
            message: 'All students fetched successfully',
            data: { students },
        });
    } catch (error) {
        checkErrorStatus(error);
        next(error);
    }
}

// exports function that gets a student by id
exports.getStudentById = async (req, res, next) => {
    // get the student id from the request query
    const { id } = req.query;

    try {
        // get the student
        const student = await Student.findById(id).populate('results');

        // check if the student exists
        if (!student) {
            // throw error
            throwError('Student does not exist', 422);
        }

        // send the student
        res.status(200).json({
            status: 200,
            message: 'Student fetched successfully',
            data: { student },
        });
    } catch (error) {
        checkErrorStatus(error);
        next(error);
    }
}

// exports function that deletes a student by id
exports.deleteStudent = async (req, res, next) => {
    // get the student id from the request query
    const { id } = req.query;

    try {
        // get the student
        const student = await Student.findById(id);
        
        // check if the student exists
        if (!student) {
            // throw error
            throwError('Student does not exist', 422);
        }

        // delete the student
        await Student.findByIdAndDelete(id);
        // send the student
        res.status(200).json({
            status: 200,
            message: 'Student deleted successfully',
        });
    } catch (error) {
        checkErrorStatus(error);
        next(error);
    }
}

// exports function that deletes all students
exports.deleteAllStudents = async (req, res, next) => {
    try {
        // get the students
        const students = await Student.find();

        // check if there are students
        if (!students.length) {
            // throw error
            throwError('There are no students to delete', 422);
        }

        // delete all students
        await Student.deleteMany();

        // send the students
        res.status(200).json({
            status: 200,
            message: 'All students deleted successfully',
        });
    } catch (error) {
        checkErrorStatus(error);
        next(error);
    }
}