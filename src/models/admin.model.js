const mongoose = require('mongoose');
const { DEFAULT_PICTURE, ROLES_OBJECT } = require('../helpers/constants');

const Schema = mongoose.Schema;

// create admin schema with station_name, address, phone, and police with reference to user
const AdminSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    profile_pic: {
        type: String,
        default: DEFAULT_PICTURE
    },
    role: {
        type: String,
        default: ROLES_OBJECT.admin,
    },
    password: {
        type: String,
        required: true
    }
});

// export police model
module.exports = mongoose.model('Admin', AdminSchema);