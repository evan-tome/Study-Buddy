const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Session = sequelize.define('Session', {
    courseCode: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    startTime: { type: DataTypes.DATE, allowNull: false },
    endTime: { type: DataTypes.DATE, allowNull: false },
    topics: { type: DataTypes.TEXT },
    maxParticipants: { type: DataTypes.INTEGER },
    creatorId: { type: DataTypes.INTEGER, allowNull: false }
}, {
    tableName: 'sessions'
});

module.exports = Session;
