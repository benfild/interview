const mongoose = require('mongoose');
const { DEFAULT_PICTURE } = require('../helpers/constants');

const Schema = mongoose.Schema;

// create student schema with name and results
const StudentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    profile_pic: {
        type: String,
        default: DEFAULT_PICTURE
    },
    results: [{
        type: Schema.Types.ObjectId,
        ref: 'Result'
    }],
});

// export citizen model
module.exports = mongoose.model('Student', StudentSchema);