const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, sessionController.createSession);
router.get('/', sessionController.getAllSessions);
router.get('/:id', sessionController.getSessionById);
router.get('/:id/messages', auth, sessionController.getSessionMessages);
router.post('/:id/join', auth, sessionController.joinSession);
router.post('/:id/leave', auth, sessionController.leaveSession);

module.exports = router;