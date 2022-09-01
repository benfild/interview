const bcrypt = require('bcryptjs');
const { config } = require('../config/variables.config');

exports.generateHash = async (password) => {
    return await bcrypt.hashSync(password, config.bcrypt.salt);
};

exports.comparePassword = async (password, hash) => {
    return await bcrypt.compareSync(password, hash);
};
