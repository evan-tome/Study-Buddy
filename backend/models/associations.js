const User = require('./User');
const Session = require('./Session');
const SessionParticipant = require('./SessionParticipant');

// Many-to-many participants
User.belongsToMany(Session, { through: SessionParticipant, as: 'sessions' });
Session.belongsToMany(User, { through: SessionParticipant, as: 'users' });

// Creator relationship
Session.belongsTo(User, { as: 'creator', foreignKey: 'creatorId' });
User.hasMany(Session, { as: 'createdSessions', foreignKey: 'creatorId' });

module.exports = { User, Session, SessionParticipant };
