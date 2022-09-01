require('dotenv').config();
// * Modules Imports
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

/**
 * @param {object} user
 * @param {string} user.id
 * @param {string} user.email
 * @param {string} user.role
 * @param {string} user.verified
 * @returns {string}
 */
exports.jwtAccessTokenToSignUser = (user) => {
    const accessToken = jwt.sign(
        {
            user_id: user._id,
            user_email: user.email,
            user_role: user.role,
            is_verified: user.verified,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1h' }
    );

    return accessToken;
};

/**
 * Return generated random string
 * @returns {string}
 */
exports.generateRandomToken = () => {
    return crypto.randomBytes(20).toString('hex');
};

/**
 * @param {string} plain_password
 * @returns {Promise<string>}
 */
exports.hashPassword = async (plain_password) => {
    return bcrypt.hash(plain_password, 12);
};

/**
 * @param {string} plain_password
 * @param {string} hashed_password
 * @returns {Promise<boolean>}
 */
exports.validatePassword = async (plain_password, hashed_password) => {
    return bcrypt.compare(plain_password, hashed_password);
};

/**
 * Add 15 minutes to the current time
 * @param {Date} date
 * @returns {Date}
 */
exports.addMinutes = (date) => {
    return new Date(date.getTime() + 15 * 60000);
};