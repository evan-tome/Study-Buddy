const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const sequelize = require('./config/db');
const { User, Session, SessionParticipant } = require('./models/associations');
const Message = require('./models/Message');

const authRoutes = require('./routes/auth');
const sessionRoutes = require('./routes/sessions');
const userRoutes = require('./routes/users');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/users', userRoutes);

const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

// Socket.io events
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinSession', ({ sessionId, user }) => {
        socket.join(sessionId);
        if (user?.name) console.log(`${user.name} joined session ${sessionId}`);
    });

    socket.on('message', async (msg) => {
        try {
            const savedMessage = await Message.create({
                content: msg.text,
                userId: msg.userId,
                sessionId: msg.sessionId
            });

            io.to(msg.sessionId).emit('message', {
                id: savedMessage.id,
                text: savedMessage.content,
                userId: savedMessage.userId,
                name: msg.name,
                createdAt: savedMessage.createdAt
            });
        } catch (err) {
            console.error('Error saving message:', err);
        }
    });

    socket.on('leaveSession', ({ sessionId, user }) => {
        socket.leave(sessionId);
        if (user?.name) console.log(`${user.name} left session ${sessionId}`);
        else console.log(`A user left session ${sessionId}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Connect to DB and start server
server.listen(process.env.PORT || 5000, async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected');
        await sequelize.sync({ alter: true }); // creates tables if missing
        console.log('DB synced');
        console.log(`Server running on port ${process.env.PORT || 5000}`);
    } catch (err) {
        console.error('DB connection error:', err);
    }
});
