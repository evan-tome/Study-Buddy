import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

let socket;

export default function SessionChatPane({ session, user }) {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!session) return;

        // Fetch chat history
        const token = localStorage.getItem('token');
        fetch(`http://localhost:5000/api/sessions/${session.id}/messages`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(setMessages);

        // Connect to socket
        socket = io('http://localhost:5000', { auth: { token } });
        socket.emit('joinSession', { sessionId: session.id, user });

        socket.on('message', msg => setMessages(prev => [...prev, msg]));
        socket.on('updateParticipants', list => {}); // could update participants if needed

        return () => {
            socket.emit('leaveSession', { sessionId: session.id, user });
            socket.disconnect();
        };
    }, [session, user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (!message.trim()) return;
        socket.emit('message', { sessionId: session.id, userId: user.id, name: user.name, text: message });
        setMessage('');
    };

    if (!session) return <div style={{ padding: '20px' }}>Select a session to chat</div>;

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '10px' }}>
            <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #ccc', borderRadius: '5px', padding: '10px', backgroundColor: '#f9f9f9' }}>
                {messages.map((m, idx) => (
                    <div key={idx} style={{ marginBottom: '8px' }}>
                        <b>{m.userId === user.id ? 'You' : m.name}:</b> {m.text}
                        <span style={{ fontSize: '0.8em', color: 'gray', marginLeft: '5px' }}>
                            {new Date(m.createdAt).toLocaleTimeString()}
                        </span>
                    </div>
                ))}
                <div ref={messagesEndRef}></div>
            </div>

            <div style={{ display: 'flex', marginTop: '10px' }}>
                <input 
                    value={message} 
                    onChange={e => setMessage(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <button onClick={sendMessage} style={{ padding: '10px 20px', marginLeft: '10px', cursor: 'pointer' }}>Send</button>
            </div>
        </div>
    );
}
