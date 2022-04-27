const Sequelize = require('sequelize');

const sequelize = new Sequelize('nodecomplete', 'root', 'Lokesh0401@', {
    dialect: 'mysql',
    host: 'ec2-13-233-153-138.ap-south-1.compute.amazonaws.com'
});

module.exports = sequelize;