const Session = require('../models/Session');
const User = require('../models/User');
const Message = require('../models/Message');

exports.createSession = async (req, res) => {
    try {
        const { courseCode, location, startTime, endTime, topics, maxParticipants, sessionType, meetingLink } = req.body;

        const session = await Session.create({
            courseCode,
            location,
            startTime,
            endTime,
            topics,
            maxParticipants,
            creatorId: req.user.id,
            sessionType: sessionType === 'online' ? 'online' : 'in_person',
            meetingLink: sessionType === 'online' ? meetingLink || null : null
        });

        // Add creator as participant
        await session.addUser(req.user.id);

        // Return session with participants
        const participants = await session.getUsers({ attributes: ['id', 'name'] });

        res.status(201).json(session);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllSessions = async (req, res) => {
    try {
        const sessions = await Session.findAll({
            include: [{ model: User, as: 'creator', attributes: ['id', 'name'] }]
        });

        res.json(sessions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getSessionById = async (req, res) => {
    try {
        const session = await Session.findByPk(req.params.id, {
            include: [
                { model: User, as: 'creator', attributes: ['id', 'name'] },
                { model: User, as: 'users', attributes: ['id', 'name'] }
            ]
        });

        if (!session) return res.status(404).json({ message: 'Not found' });

        res.json(session);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.joinSession = async (req, res) => {
    try {
        const session = await Session.findByPk(req.params.id, {
            include: [{ model: User, as: 'users', attributes: ['id', 'name'] }]
        });

        if (!session) return res.status(404).json({ message: 'Session not found' });

        if (session.creatorId === req.user.id) {
            return res.status(400).json({ message: 'You cannot join your own session.' });
        }

        // Check if user already joined
        const alreadyJoined = session.users.some(u => u.id === req.user.id);
        if (alreadyJoined) return res.status(400).json({ message: 'Already joined' });

        // Optional: check max participants
        if (session.maxParticipants && session.users.length >= session.maxParticipants) {
            return res.status(400).json({ message: 'Session full' });
        }

        await session.addUser(req.user.id);

        // Return updated participants
        const participants = await session.getUsers({ attributes: ['id', 'name'] });

        res.json({ message: 'Joined session', participants });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.leaveSession = async (req, res) => {
    try {
        const session = await Session.findByPk(req.params.id, {
            include: [{ model: User, as: 'users', attributes: ['id', 'name'] }]
        });

        if (!session) return res.status(404).json({ message: 'Session not found' });

        // Creator leaving = delete the session
        if (session.creatorId === req.user.id) {
            await session.destroy();
            return res.json({ message: 'Session deleted' });
        }

        const participantCount = session.users?.length ?? 0;
        if (participantCount <= 1) {
            return res.status(400).json({
                message: 'Cannot leave: the session would have no members.'
            });
        }

        await session.removeUser(req.user.id);

        // Return updated participants
        const participants = await session.getUsers({ attributes: ['id', 'name'] });

        res.json({ message: 'Left session', participants });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateSession = async (req, res) => {
    try {
        const session = await Session.findByPk(req.params.id);
        if (!session) return res.status(404).json({ message: 'Session not found' });
        if (session.creatorId !== req.user.id) {
            return res.status(403).json({ message: 'Only the creator can update this session' });
        }

        const { courseCode, location, startTime, endTime, topics, maxParticipants, sessionType, meetingLink } = req.body;
        const type = sessionType === 'online' ? 'online' : 'in_person';
        await session.update({
            ...(courseCode != null && { courseCode }),
            ...(location != null && { location }),
            ...(startTime != null && { startTime }),
            ...(endTime != null && { endTime }),
            ...(topics != null && { topics }),
            ...(maxParticipants != null && { maxParticipants }),
            ...(sessionType != null && { sessionType: type }),
            ...(sessionType != null && { meetingLink: type === 'online' ? (meetingLink || null) : null })
        });

        const updated = await Session.findByPk(session.id, {
            include: [{ model: User, as: 'creator', attributes: ['id', 'name'] }]
        });
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteSession = async (req, res) => {
    try {
        const session = await Session.findByPk(req.params.id);
        if (!session) return res.status(404).json({ message: 'Session not found' });
        if (session.creatorId !== req.user.id) {
            return res.status(403).json({ message: 'Only the creator can delete this session' });
        }
        await session.destroy();
        res.json({ message: 'Session deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getSessionMessages = async (req, res) => {
    try {
        const sessionId = req.params.id;

        const messages = await Message.findAll({
            where: { sessionId },
            include: [{ model: User, as: 'sender', attributes: ['id', 'name'] }],
            order: [['createdAt', 'ASC']]
        });

        const formatted = messages.map(m => ({
            id: m.id,
            text: m.content,
            userId: m.userId,
            name: m.sender?.name || 'Unknown',
            createdAt: m.createdAt
        }));

        res.json(formatted);
    } catch (err) {
        console.error('Failed to fetch messages:', err);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};


