const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { RESULT_STATUS } = require('../helpers/constants');

const ResultSchema = new Schema({
    math: {type: String, required: true },
    eng: { type: String, required: true },
    phy: { type: String, required: true },
    chem: { type: String, required: true},
    bio: { type: String, required: true },
    status: { type: String, default: RESULT_STATUS.incomplete },
    average: {type: Number, required: true},
    reporter: {
        id: { type: Schema.Types.ObjectId, ref: 'User' },
        name: String
    },
    filled_on: { type: Date, required: true },
}, { timestamps: true });

// export result model
module.exports = mongoose.model('Result', ResultSchema);