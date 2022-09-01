const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// helpers variables
const { throwError, checkErrorStatus } = require('../../helpers/handler');
const { generateRandomToken, addMinutes, jwtAccessTokenToSignUser } = require('../../helpers/jwt');

// import user, police, citizen and organization models
const User = require('../models/user.model');;
const Citizen = require('../models/citizen.model');

// exports authenticate async function with email and password
exports.authenticate = async (req, res, next) => {
    // get the email and password from the request body
    // const { email, password } = req.body;
    const { mobile , password } = req.body
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
        const user = await User.findOne({ phone: mobile })

        // check if the user exists
        if (!user) {
            // throw error
            throwError('Could not find user, consider creating account', 404);
        }

        // check if the user is verified
        if (!user.verified) {
            // throw error
            throwError('Please verify your account', 422);
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
                id: user._id,
                username: user.username,
                profile_pic: user.profile_pic,
                email: user.email,
                role: user.role,
                verified: user.verified,
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

// exports forgot password async function with email, requestOS and requestBrowser
exports.forgotPassword = async (req, res, next) => {
    // get the email from the request body
    const { email, requestOS, requestBrowser } = req.body;

    try {
        // get the validation errors
        const errors = validationResult(req);

        // check if there are errors
        if (!errors.isEmpty()) {
            // throw error
            throwError('Invalid email', 422, errors.array());
        }

        // check if the user exists
        const user = await User.findOne({ email });

        // check if the user exists
        if (!user) {
            // throw error
            throwError('Could not find user with this email address', 404);
        }

        // generate the verification token
        const verificationToken = generateRandomToken();

        // set the verification token
        user.verificationToken = verificationToken;

        // set the verification time
        user.verifyTime = addMinutes(new Date());

        // save the user
        await user.save();
        
        // create requestingPlatform object
        const requestingPlatform ={
            requestOS: requestOS,
            requestBrowser: requestBrowser
        };
        
        // send password reset email
        sendPasswordResetEmail(user, 15, requestingPlatform);
        
        // send the verification token
        res.status(200).json({
            status: 200,
            message: 'Verification email sent successfully',
            data: {
                verificationToken,
            },
        });
    } catch (err) {
        checkErrorStatus(err);
        // send the error
        next(err);
    }
}

// exports resetPassword with received password and query token
exports.resetPassword = async (req, res, next) => {
    // get the password and token from the request body
    const token = req.query.token;
    const password = req.body;

    try {
        // get the validation errors
        const errors = validationResult(req);

        // check if there are errors
        if (!errors.isEmpty()) {
            // throw error
            throwError('Invalid password', 422, errors.array());
        }

        // check if the user exists
        const user = await User.findOne({ verificationToken: token });

        // check if the user exists
        if (!user) {
            // throw error
            throwError('Invalid token, consider to request password reset again', 422);
        }

        // check if the token is expired
        if (user.verifyTime < new Date()) {
            // throw error
            throwError('Link has expired. Provide your email so we can send a new link to reset password', 422);
        }

        // hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // set the password
        user.password = hashedPassword;

        // remove the verification token
        user.verificationToken = null;

        // remove verification time
        user.verifyTime = null;

        // save the user
        await user.save();

        // send the success message
        res.status(200).json({
            status: 200,
            message: 'Password reset successfully',
        });
    } catch (err) {
        checkErrorStatus(err);
        // send the error
        next(err);
    }
}