const Sequelize = require('sequelize');

const sequelize = new Sequelize('nodecomplete', 'root', 'Lokesh0401@', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;