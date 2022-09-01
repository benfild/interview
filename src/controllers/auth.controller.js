const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// helpers variables
const { throwError, checkErrorStatus } = require('../helpers/handler');
const { jwtAccessTokenToSignUser } = require('../helpers/jwt');

// import user, police, citizen and organization models
const User = require('../models/user.model');;

// exports authenticate async function with email and password
exports.authenticate = async (req, res, next) => {
    // get the email and password from the request body
    // const { email, password } = req.body;
    const { email , password } = req.body
    console.log(req.body)
    try {
        // get the validation errors
        const errors = validationResult(req);

        // check if there are errors
        if (!errors.isEmpty()) {
            // throw error
            throwError('Phone number or password is incorrect', 422, errors.array());
        }

        // check if the user exists
        // const user = await User.findOne({ email });
        const user = await User.findOne({ email: email })

        // check if the user exists
        if (!user) {
            // throw error
            throwError('Could not find user, consider register', 404);
        }

        // check if the password is correct
        const isValidPassword = await bcrypt.compare(password, user.password);

        // check if the password is correct
        if (!isValidPassword) {
            // throw error
            throwError('Invalid email or password', 422);
        }

        // send the access token
        res.status(200).json({
            status: 200,
            message: 'Logged in successfully',
            data: {
                user,
                accessToken: jwtAccessTokenToSignUser(user),
                expiresIn: 3600
            },
        });
    } catch (err) {
        checkErrorStatus(err);
        // send the error
        next(err);
    }
}