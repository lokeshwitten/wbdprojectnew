const Sequelize = require('sequelize')

const sequelize = require('../util/database')

const Schedule = sequelize.define('Schedule', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    duration: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    calories: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    distance: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    category: {
        type: Sequelize.STRING,
        allowNull: false
    },
    day: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.STRING
    }
})
module.exports = Schedule