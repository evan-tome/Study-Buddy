const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Session = require('./Session');

const Message = sequelize.define('Message', {
    content: { type: DataTypes.TEXT, allowNull: false }
}, {
    tableName: 'messages',
    timestamps: true
});

Message.belongsTo(User, { foreignKey: 'userId', as: 'sender' });
Message.belongsTo(Session, { foreignKey: 'sessionId' });

module.exports = Message;
