import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { io } from 'socket.io-client';
import './SessionChat.css';

let socket;

export default function SessionChat({ sessionName }) {
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

        fetch(`http://localhost:5000/api/sessions/${sessionId}/messages`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(data => setMessages(data))
            .catch(err => console.error('Failed to load chat history', err));

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

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="session-chat">
            <div className="session-chat-messages">
                {messages.length === 0 && (
                    <div className="session-chat-empty">
                        No messages yet. Say something to get the conversation started.
                    </div>
                )}
                {messages.map((m, idx) => {
                    const isSent = m.userId === user?.id;
                    return (
                        <div
                            key={m.id || idx}
                            className={`session-chat-bubble-wrap ${isSent ? 'sent' : ''}`}
                        >
                            <div className="session-chat-bubble">
                                {!isSent && (
                                    <div className="session-chat-bubble-sender">{m.name}</div>
                                )}
                                <div>{m.text}</div>
                                <div className="session-chat-bubble-time">
                                    {m.createdAt
                                        ? new Date(m.createdAt).toLocaleTimeString(undefined, {
                                              hour: 'numeric',
                                              minute: '2-digit'
                                          })
                                        : ''}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="session-chat-input-area">
                <input
                    type="text"
                    className="session-chat-input"
                    placeholder="Message..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button
                    type="button"
                    className="session-chat-send"
                    onClick={sendMessage}
                    disabled={!message.trim()}
                >
                    Send
                </button>
            </div>
        </div>
    );
}
