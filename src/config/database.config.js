const { Sequelize } = require('sequelize');
const { config } = require('./variables.config');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db.sqlite',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    logging: false,
    define: {
        underscored: true,
    },
});

module.exports = {
    sequelize,
    Sequelize,
};
