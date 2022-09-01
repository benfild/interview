const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// helpers variables
const { throwError, checkErrorStatus } = require('../helpers/handler');
const { ROLES_OBJECT } = require('../helpers/constants');

// import user, police, user and organization models
const User = require('../models/user.model');


// exports register function that creates a new user 
exports.register = async (req, res, next) => {
    // get the email, password, name
    const { name, email, password, type } = req.body;

    try {
        // get the validation errors
        const errors = validationResult(req);

        // check if there are errors
        if (!errors.isEmpty()) {
            // throw error
            throwError('Invalid credentials', 422, errors.array());
        }

        // check if the user exists
        const user = await User.findOne({ email: email });

        // check if the user exists
        if (user) {
            // throw error
            throwError('Email already exists', 422);
        }

        // hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        if (type === ROLES_OBJECT.teacher) {
            // create the teacher
            const newUser = new User({
                name,
                email,
                role: ROLES_OBJECT.teacher,
                password: hashedPassword
            });
        } else {
            // create the user
            const newUser = new User({
                name,
                email,
                role: ROLES_OBJECT.admin,
                password: hashedPassword
            });
        }

        // save the user
        await newUser.save();

        // send the verification token
        res.status(200).json({
            status: 200,
            message:    `${type} registered successfully` ,
        });
    } catch (err) {
        checkErrorStatus(err);
        // send the error
        next(err);
    }
}

// exports function that get all users
exports.getUsers = async (req, res, next) => {
    try {
        // get the users
        const users = await User.find();

        // send the users
        res.status(200).json({
            status: 200,
            message: 'Users fetched successfully',
            data: {
                users,
            },
        });
    } catch (err) {
        checkErrorStatus(err);
        // send the error
        next(err);
    }
}

// exports function that get a user
exports.getUser = async (req, res, next) => {
    // get the user id from the request query
    const { user_id } = req.query;

    try {
        // get the user
        const user = await User.findById(user_id);

        // check if the user is not found
        if (!user) {
            // throw error
            throwError('User not found', 404);
        }

        // send the user
        res.status(200).json({
            status: 200,
            message: 'User fetched successfully',
            data: {
                user,
            },
        });
    } catch (err) {
        checkErrorStatus(err);
        // send the error
        next(err);
    }
}

// exports function that delete a user and its user details
exports.deleteUser = async (req, res, next) => {
    // get the user id from the request query
    const { user_id } = req.query;

    try {
        // get the user
        const user = await User.findById(user_id);

        // check if the user is not found
        if (!user) {
            // throw error
            throwError('User not found', 404);
        }

        // delete the user
        await user.remove();

        // send the user
        res.status(200).json({
            status: 200,
            message: 'User deleted successfully',
        });
    } catch (err) {
        checkErrorStatus(err);
        // send the error
        next(err);
    }
}