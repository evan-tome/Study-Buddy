const express = require('express');
const router = express.Router();
const auth = require('../middleware/AuthMiddleware');
const { User, Session } = require('../models/associations');

// GET /api/users/me/sessions
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

module.exports = router;
