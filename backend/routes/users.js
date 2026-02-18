const express = require('express');
const router = express.Router();
const auth = require('../middleware/AuthMiddleware');
const { User, Session } = require('../models/associations');

// GET /api/users/me/sessions - must be before /:id
router.get('/me/sessions', auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            include: [{ model: Session, as: 'sessions' }] // sessions joined
        });
        res.json(user.sessions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/users/:id - public profile (no email/password)
router.get('/:id', auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: ['id', 'name', 'program', 'year']
        });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
