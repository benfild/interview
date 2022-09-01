const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { VERIFICATION_OBJECT, DEFAULT_PICTURE, ROLES_OBJECT} = require('../helpers/constants');

// create user model schema with name, email, password and role
const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    profile_pic: {
        type: String,
        default: DEFAULT_PICTURE
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: ROLES_OBJECT.citizen,
    },
    verified: {
        type: Boolean,
        default: VERIFICATION_OBJECT.unverified
    },
    verificationToken: {type: String},
    verifyTime: {type: Date}
});

// export user model
module.exports = mongoose.model('User', UserSchema);