const mongoose = require('mongoose');
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
    password: {
        type: String,
        required: true
    }
});

// export police model
module.exports = mongoose.model('Admin', AdminSchema);