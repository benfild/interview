const { validationResult } = require('express-validator');

// helpers variables
const { throwError, checkErrorStatus } = require('../../helpers/handler');
const { RESULT_STATUS } = require('../helpers/constants');



// import student model and user model
const Student = require('../models/student.model');
const User = require('../models/user.model');
const Result = require('../models/result.model');

// exports function that get all results from a student
exports.getResult = async (req, res, next) => {
    // get the student id from the request body
    const { student_id } = req.body;
    try {
        // get the student
        const student = await Student.findById(student_id).populate('results');
        // check if the student exists
        if (!student) {
            // throw error
            throwError('Student not found', 404);
        }
        // send the student
        res.status(200).json({
            status: 200,
            message: 'Result fetched successfully',
            data: {
                student,
            },
        });
    } catch (err) {
        checkErrorStatus(err);
        // send the error
        next(err);
    }
}

// exports function that get all students with their results
exports.getAllResults = async (req, res, next) => {
    try {
        // get the students
        const students = await Student.find().populate('results');
        // check if the students exists
        if (!students) {
            // throw error
            throwError('Students not found', 404);
        }
        // send the students
        res.status(200).json({
            status: 200,
            message: 'Results fetched successfully',
            data: {
                students,
            },
        });
    } catch (err) {
        checkErrorStatus(err);
        // send the error
        next(err);
    }
}



// exports function that create a result then add that result to a student
exports.addResult = async (req, res, next) => {
    // get the student id from the request query
    const { student_id } = req.query;

    // get the result from the request body
    const { mathematics, english, physics, chemistry, biology } = req.body;

    // get result average
    const average = (mathematics + english + physics + chemistry + biology) / 5;
    const status = RESULT_STATUS.pending;

    // check if average is greater than 50 set result status to pass if average is less than 50 set result status to fail otherwise set to pending
    if (average >= 50) {
        status = RESULT_STATUS.pass;
    } else if(average < 50) {
        status = RESULT_STATUS.fail;
    }

    try {
        // get the validation errors
        const errors = validationResult(req);

        // check if there are errors
        if (!errors.isEmpty()) {
            // throw error
            throwError('Invalid result fields', 422, errors.array());
        }

        // get the student
        const std = await Student.findById(student_id);

        // check if the student exists
        if (!std) {
            // throw error
            throwError('Student does not exist', 422);
        }

        // create a reporter object
        const reporter = {
            id: req.user._id,
            name: req.user.name,
        };

        // create a result
        const newResult = new Result({
            math: mathematics,
            eng: english,
            phy: physics,
            chem: chemistry,
            bio: biology,
            status: status,
            average: average,
            filled_on: new Date()
        });

        newResult.reporter.id = reporter.id;
        newResult.reporter.name = reporter.name;

        // save the result
        await newResult.save();

        // add the result to the student
        std.results.push(newResult);

        // save the student
        await std.save();
        const student = await Student.findById(student_id).populate('results');

        // send the student
        res.status(200).json({
            status: 200,
            result: 'Result added successfully',
            data: { student },
        });
    } catch (error) {
        checkErrorStatus(error);
        next(error);
    }
}

// exports function that updates the result
exports.updateResult = async (req, res, next) => {
    // get the result id from the request query
    const { result_id } = req.query;

    // get the result from the request body
    const { mathematics, english, physics, chemistry, biology } = req.body;

    // get result average
    const average = (mathematics + english + physics + chemistry + biology) / 5;
    const status = RESULT_STATUS.pending;

    // check if average is greater than 50 set result status to pass if average is less than 50 set result status to fail otherwise set to pending
    if (average >= 50) {
        status = RESULT_STATUS.pass;
    } else if(average < 50) {
        status = RESULT_STATUS.fail;
    }

    try {
        // get the validation errors
        const errors = validationResult(req);
        
        // check if there are errors
        if (!errors.isEmpty()) {
            // throw error
            throwError('Invalid result fields', 422, errors.array());
        }

        // get the result
        const result = await Result.findById(result_id);
        
        // remove old results from the student and add new Results
        const std = await Student.findById(student_id).populate('results');
        await std.results.pull(result_id);

        // check if the result exists
        if (!result) {
            // throw error
            throwError('Result does not exist', 422);
        }
        // update the result
        result.math = mathematics;
        result.eng = english;
        result.phy = physics;
        result.chem = chemistry;
        result.bio = biology;
        result.status = status;
        result.average = average;
        result.filled_on = new Date();
        // save the result
        await result.save();
        
        // add new Results
        std.results.push(result);
        await student.save();

        // send the student
        res.status(200).json({
            status: 200,
            result: 'Result updated successfully',
            data: { student },
        });
    } catch (error) {
        checkErrorStatus(error);
        next(error);
    }
}

// exports function that delete a result from Result and remove it from the student
exports.deleteResult = async (req, res, next) => {
    // get the student id and result id from the request query
    const { student_id, result_id } = req.query;

    try {
        // get the student
        const student = await Student.findById(student_id);

        // check if the student exists
        if (!student) {
            // throw error
            throwError('Student does not exist', 422);
        }

        // get the result
        const result = await Result.findById(result_id);
 
        // check if the result exists
        if (!result) {
            // throw error
            throwError('Result does not exist', 422);
        }
        

        // remove the result from the student
        student.results.pull(result);
        
        // save the student
        await student.save();
        
        // remove the result from Result
        await Result.findByIdAndRemove(result_id);

        // send the student
        res.status(200).json({
            status: 200,
            result: 'Result deleted successfully',
            data: { student },
        });
    } catch (error) {
        checkErrorStatus(error);
        next(error);
    }
}
