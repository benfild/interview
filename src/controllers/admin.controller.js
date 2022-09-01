const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// helpers variables
const { throwError, checkErrorStatus } = require('../../helpers/handler');
const { generateRandomToken, addMinutes, jwtAccessTokenToSignUser } = require('../../helpers/jwt');
const { sendEmailVerification, sendPasswordResetEmail } = require('../../helpers/email');
const { ROLES_OBJECT } = require('../../helpers/constants');

// import user, police, admin and organization models
const User = require('../models/user.model');
const Admin = require('../models/admin.model');


// exports register function that creates a new user then sends an email verification
exports.register = async (req, res, next) => {
    // get the email, password, fullName, role and phoneNumber from the request body
    const { fullName, mobile, nida, homeAddress, email, password, } = req.body;
    console.log(req.body);
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

        // add new admin
        const admin = new Admin({
            full_name: fullName,
            phone: mobile,
            address: homeAddress,
            email,
            nida,
        });
        // save the admin
        await admin.save();

        // hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // create the user
        const newUser = new User({
            username: fullName,
            email,
            phone: mobile,
            role: ROLES_OBJECT.admin,
            password: hashedPassword
        });

        // generate the verification token
        const verificationToken = generateRandomToken();

        // set the verification token
        newUser.verificationToken = verificationToken;

        // set the verification time
        newUser.verifyTime = addMinutes(new Date());

        // save the user
        await newUser.save();
        
        // send email verification
        sendEmailVerification(newUser, 15);

        // send the verification token
        res.status(200).json({
            status: 200,
            message: 'Verification email sent successfully, Check your email to verify your account.',
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

// exports function that get all admins
exports.getAdmins = async (req, res, next) => {
    try {
        // get the admins
        const admins = await Admin.find({});

        // send the admins
        res.status(200).json({
            status: 200,
            message: 'Admins fetched successfully',
            data: {
                admins,
            },
        });
    } catch (err) {
        checkErrorStatus(err);
        // send the error
        next(err);
    }
}

// exports function that get a admin
exports.getAdmin = async (req, res, next) => {
    // get the admin id from the request query
    const { id } = req.query;

    try {
        // get the admin
        const admin = await Admin.findById(id);

        // check if the admin is not found
        if (!admin) {
            // throw error
            throwError('Admin not found', 404);
        }

        // send the admin
        res.status(200).json({
            status: 200,
            message: 'Admin fetched successfully',
            data: {
                admin,
            },
        });
    } catch (err) {
        checkErrorStatus(err);
        // send the error
        next(err);
    }
}

// exports function that update a admin
exports.updateAdmin = async (req, res, next) => {
    // get the admin id from the request query
    const { id } = req.query;

    // get the admin data from the request body
    const { fullName, mobile, nida, homeAddress, email } = req.body;

    try {
        // get the admin
        const admin = await Admin.findById(id);

        // check if the admin is not found
        if (!admin) {
            // throw error
            throwError('Admin not found', 404);
        }

        // check if the email is not the same
        if (admin.email !== email) {
            // get the user
            const user = await User.findOne({ email: email });

            // check if the user is not found
            if (user) {
                // throw error
                throwError('User with that email already exists!!', 422);
            }
        }

        // get user 
        const user = await User.findOne({email: admin.email});
        
        // update the user
        user.username = fullName;
        user.email = email;
        // save the user
        await user.save();

        // update the admin
        admin.full_name = fullName;
        admin.phone = mobile;
        admin.address = homeAddress;
        admin.email = email;
        admin.nida = nida;

        // save the admin
        await admin.save();

        // send the admin
        res.status(200).json({
            status: 200,
            message: 'Admin updated successfully',
            data: {
                admin,
                user
            },
        });
    } catch (err) {
        checkErrorStatus(err);
        // send the error
        next(err);
    }
}

// exports function that delete a admin and its user details
exports.deleteAdmin = async (req, res, next) => {
    // get the admin id from the request query
    const { id } = req.query;

    try {
        // get the admin
        const admin = await Admin.findById(id);

        // check if the admin is not found
        if (!admin) {
            // throw error
            throwError('Admin not found', 404);
        }

        // get the user
        const user = await User.findOne({email: admin.email});

        // check if the user is not found
        if (!user) {
            // throw error
            throwError('User not found', 404);
        }

        // delete the admin
        await admin.remove();

        // delete the user
        await user.remove();

        // send the admin
        res.status(200).json({
            status: 200,
            message: 'Admin deleted successfully',
            data: {
                admin,
                user
            },
        });
    } catch (err) {
        checkErrorStatus(err);
        // send the error
        next(err);
    }
}