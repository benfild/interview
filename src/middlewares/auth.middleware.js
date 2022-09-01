require('dotenv').config();

const jwt = require('jsonwebtoken');
const { throwError, checkErrorStatus } = require('../../helpers/handler');
const { ROLES_OBJECT } = require('../../helpers/constants');

// import user model
const User = require('../models/user.model');

// exports isAuthenticated function that checks if the user is authorized with auth token and its session
exports.isAuthenticated = async (req, res, next) => {
    // get the auth token from the request header
    const authHeader = req.headers['authorization'];

    // verify the auth token
    try {
        // check if the auth token is not provided
        if (!authHeader) {
            // throw error
            throwError('Not authenticated, please login', 401);
        }

        // get the auth token
        const token = authHeader.split(' ')[1];

        // check if the auth token is not provided
        if (!token) {
            // throw error
            throwError('Not authenticated, please login', 401);
        }

        // verify the auth token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // check if the user is not found
        if (!decoded) {
            // throw error
            throwError('Not authenticated, please login', 401);
        }

        // get the user id from the decoded auth token
        const userId = decoded.user_id;

        // check if the user id is not provided
        if (!userId) {
            // throw error
            throwError('User id is not provided', 401);
        }

        // get the user from the database
        const user = await User.findById(userId);

        // check if the user is not found
        if (!user) {
            // throw error
            throwError('User is not found, consider to register', 401);
        }

        // set the user id to the request object
        req.userId = userId;

        // set the user to the request object
        req.user = user;

        // call the next middleware
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            error.status = 401;
            error.message = 'Not authenticated, consider login.';
        } else if (error.name === 'TokenExpiredError') {
            error.status = 401;
            error.message = 'Session expired, consider login.';
        }
        next(error);
    }
}

// exports a middleware that checks if the user is authorized with police role to access the route
exports.isPolice = async (req, res, next) => {
    // check if the user is not authorized
    if (req.user.role !== ROLES_OBJECT.police) {
        // throw error
        throwError('You are not authorized to do that!!', 401);
    }

    // call the next middleware
    next();
}

// exports a middleware that checks if the user is authorized with admin role to access the route
exports.isAdmin = async (req, res, next) => {
    // check if the user is not authorized
    if (req.user.role !== ROLES_OBJECT.admin) {
        // throw error
        throwError('You are not authorized to do that!!', 401);
    }

    // call the next middleware
    next();
}

// exports a middleware that checks if the user is authorized with organization role to access the route
exports.isOrganization = async (req, res, next) => {
    // check if the user is not authorized
    if (req.user.role !== ROLES_OBJECT.organization) {
        // throw error
        throwError('You are not authorized to do that!!', 401);
    }

    // call the next middleware
    next();
}

// exports a middleware that checks if the user is authorized with user citizen role to access the route
exports.isCitizen = async (req, res, next) => {
    // check if the user is not authorized
    if (req.user.role !== ROLES_OBJECT.citizen) {
        // throw error
        throwError('You are not authorized to do that!!', 401);
    }

    // call the next middleware
    next();
}