import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { io } from 'socket.io-client';

let socket;

export default function SessionChat() {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [participants, setParticipants] = useState([]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        let decoded;
        try {
            decoded = jwtDecode(token);
            setUser(decoded);
        } catch {
            localStorage.removeItem('token');
            navigate('/login');
            return;
        }

        // Fetch chat history
        fetch(`http://localhost:5000/api/sessions/${sessionId}/messages`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        })
        .then(data => setMessages(data))
        .catch(err => console.error('Failed to load chat history', err));

        // Connect to socket
        socket = io('http://localhost:5000', { auth: { token } });
        socket.emit('joinSession', { sessionId, user: decoded });

        const handleMessage = (msg) => setMessages(prev => [...prev, msg]);
        socket.on('message', handleMessage);
        socket.on('updateParticipants', setParticipants);

        return () => {
            socket.emit('leaveSession', { sessionId, user: decoded });
            socket.off('message', handleMessage);
            socket.disconnect();
        };
    }, [sessionId, navigate]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (!message.trim() || !user) return;
        socket.emit('message', { sessionId, userId: user.id, name: user.name, text: message });
        setMessage('');
    };

    const handleKeyPress = (e) => { if (e.key === 'Enter') sendMessage(); };
    const leaveSession = () => { socket.emit('leaveSession', { sessionId, user }); navigate('/dashboard'); };

    return (
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '20px' }}>
            <h2>Session Chat: {sessionId}</h2>
            <div style={{ marginBottom: '10px' }}>
                <b>Participants:</b> {participants.map(p => p.name).join(', ')}
            </div>
            <div style={{
                border: '1px solid gray',
                borderRadius: '5px',
                height: '350px',
                overflowY: 'scroll',
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: '#f9f9f9'
            }}>
                {messages.map((m, idx) => (
                    <div key={idx} style={{ marginBottom: '8px' }}>
                        <b>{m.userId === user?.id ? 'You' : m.name}:</b> {m.text}
                        <span style={{ fontSize: '0.8em', color: 'gray', marginLeft: '5px' }}>
                            {new Date(m.createdAt).toLocaleTimeString()}
                        </span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{ width: '80%', padding: '10px', marginRight: '10px', borderRadius: '5px', border: '1px solid gray' }}
            />
            <button onClick={sendMessage} style={{ padding: '10px 20px', marginRight: '10px', cursor: 'pointer' }}>Send</button>
            <button onClick={leaveSession} style={{ padding: '10px 20px', cursor: 'pointer' }}>Leave Session</button>
        </div>
    );
}
