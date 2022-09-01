const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { Nidajs } = require('@jackkweyunga/nidajs');

// helpers variables
const { throwError, checkErrorStatus } = require('../../helpers/handler');
const { generateRandomToken, addMinutes, jwtAccessTokenToSignUser } = require('../../helpers/jwt');
const { sendEmailVerification, sendPasswordResetEmail } = require('../../helpers/email');
const { sendSMSVerification, outGoingSMSValidate } = require('../../helpers/sms');

// import user, police, citizen and organization models
const User = require('../models/user.model');
const Citizen = require('../models/citizen.model');


// exports register function that creates a new user then sends an email verification
exports.register = async (req, res, next) => {
    // get the email, password, firstName, lastName, role and phoneNumber from the request body
    const { firstName, middleName, lastName, mobile, nida, homeAddress, email, password, } = req.body;
    const username = firstName + ' ' + middleName + ' ' + lastName;

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
        const user = await User.findOne({ phone: mobile });

        // check if the user exists
        if (user) {
            // throw error
            throwError('Phone number already exists', 422);
        }

        // check nida number if exist
        const user_nida = await Citizen.findOne({ nida: nida });
        if (user_nida) {
            // throw error
            throwError('User with that NIDA number already exists.', 422);
        }

        const nidaJs = new Nidajs();
        await nidaJs.loadDetails(nida.toString()).then( async(res) => {
            console.log(res);
            if(res == undefined){
                throwError('Invalid NIDA number', 422);
            } else {
            if (res.FirstName.toLowerCase() === firstName.toLowerCase() && res.LastName.toLowerCase() === lastName.toLowerCase()) {
                console.log('nida match');
                // add new citizen
                const citizen = new Citizen({
                    first_name: firstName,
                    middle_name: middleName,
                    last_name: lastName,
                    phone: mobile,
                    address: homeAddress,
                    email,
                    nida,
                });
                // save the citizen
                await citizen.save();

                // hash the password
                const hashedPassword = await bcrypt.hash(password, 12);

                // create the user
                const newUser = new User({
                    username,
                    email,
                    phone: mobile,
                    password: hashedPassword
                });

                // generate the verification token
                // const verificationToken = generateRandomToken();
                const verificationToken = Math.floor(100000 + Math.random() * 900000);
                console.log(verificationToken);

                // set the verification token
                newUser.verificationToken = verificationToken;

                // set the verification time
                newUser.verifyTime = addMinutes(new Date());

                // save the user
                await newUser.save();

                // send email verification
                // await sendEmailVerification(newUser, 15);
                // Send SMS verification
                const phone = '+255' + mobile.slice(1).toString();
                console.log(phone);
                // await outGoingSMSValidate(phone, username);
                await sendSMSVerification(phone, verificationToken);

            } else {
                throwError('Invalid NIDA number. Make sure it\'s Yours.', 422);
            }
        }
        })
        .catch(err => {
            // console.log(err);
            // return throwError('Invalid NIDA number', 422);
            checkErrorStatus(err);
            // send the error
            next(err);
        });

    
        res.status(200).json({
            status: 200,
            message: "Verification code sent successfully. Check your SMS inbox on your phone."
        });
    } catch (err) {
        checkErrorStatus(err);
        // send the error
        next(err);
    }
}

// exports function that get all citizens
exports.getCitizens = async (req, res, next) => {
    try {
        // get the citizens
        const citizens = await Citizen.find();

        // send the citizens
        res.status(200).json({
            status: 200,
            message: 'Citizens fetched successfully',
            data: {
                citizens: citizens,
            },
        });
    } catch (err) {
        checkErrorStatus(err);
        // send the error
        next(err);
    }
}

// exports function that get a citizen
exports.getCitizen = async (req, res, next) => {
    // get the citizen id from the request query
    const { id } = req.query;

    try {
        // get the citizen
        const citizen = await Citizen.findById(id);

        // check if the citizen is not found
        if (!citizen) {
            // throw error
            throwError('Citizen not found', 404);
        }

        // send the citizen
        res.status(200).json({
            status: 200,
            message: 'Citizen fetched successfully',
            data: {
                citizen,
            },
        });
    } catch (err) {
        checkErrorStatus(err);
        // send the error
        next(err);
    }
}

// exports function that update a citizen
exports.updateCitizen = async (req, res, next) => {
    // get the citizen id from the request query
    const { id } = req.query;

    // get the citizen data from the request body
    const { firstName, middleName, lastName, mobile, nida, homeAddress, email, password, } = req.body;
    const username = firstName + ' ' + middleName + ' ' + lastName;

    try {
        // get the citizen
        const citizen = await Citizen.findById(id);

        // check if the citizen is not found
        if (!citizen) {
            // throw error
            throwError('Citizen not found', 404);
        }

        // check if the email is not the same
        if (citizen.email !== email) {
            // get the user
            const user = await User.findOne({ email: email });

            // check if the user is not found
            if (user) {
                // throw error
                throwError('User already exists', 422);
            }
        }

        // get user 
        const user = await User.findOne({ email: citizen.email });

        // update the user
        user.username = username;
        user.email = email;
        // save the user
        await user.save();

        // update the citizen
        citizen.first_name = firstName;
        citizen.middle_name = middleName;
        citizen.last_name = lastName;
        citizen.phone = mobile;
        citizen.address = homeAddress;
        citizen.email = email;
        citizen.nida = nida;

        // save the citizen
        await citizen.save();

        // send the citizen
        res.status(200).json({
            status: 200,
            message: 'Citizen updated successfully',
            data: {
                citizen,
                user
            },
        });
    } catch (err) {
        checkErrorStatus(err);
        // send the error
        next(err);
    }
}

// export a function that delete a citizen by email and also delete from user data
exports.deleteCitizen = async (req, res, next) => {
    // get the citizen id from the request query
    const { id } = req.query;

    try {
        // get the citizen
        const citizen = await Citizen.findById(id);

        // check if the citizen is not found
        if (!citizen) {
            // throw error
            throwError('Citizen not found', 404);
        }

        // get the user
        const user = await User.findOne({ email: citizen.email });

        // check if the user is not found
        if (!user) {
            // throw error
            throwError('User not found', 404);
        }

        // delete the citizen
        await Citizen.findByIdAndDelete(id);

        // delete the user
        await User.findByIdAndDelete(user._id);

        // send the citizen
        res.status(200).json({
            status: 200,
            message: 'Citizen deleted successfully',
        });
    } catch (err) {
        checkErrorStatus(err);
        // send the error
        next(err);
    }
}