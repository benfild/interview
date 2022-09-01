const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create student schema with first_name, middle_name, last_name, nida number, phone number, address, email and password
const StudentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    results: [{
        type: Schema.Types.ObjectId,
        ref: 'Result'
    }],
});

// export citizen model
module.exports = mongoose.model('Student', StudentSchema);