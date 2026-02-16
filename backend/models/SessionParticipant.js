const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SessionParticipant = sequelize.define('SessionParticipant', {}, {
    tableName: 'session_participants'
});

module.exports = SessionParticipant;
