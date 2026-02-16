import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import SessionChat from '../Sessions/SessionChat';
import { jwtDecode } from 'jwt-decode';

export default function SessionDashboard() {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = token ? jwtDecode(token) : null;

    const [sessions, setSessions] = useState([]);
    const [currentSession, setCurrentSession] = useState(null);
    const [participants, setParticipants] = useState([]);

    // Fetch all sessions user has joined
    const fetchJoinedSessions = async () => {
        try {
            const res = await API.get('/users/me/sessions', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSessions(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // Fetch single session info
    const fetchSession = async (id) => {
        try {
            const res = await API.get(`/sessions/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCurrentSession(res.data);
            setParticipants(res.data.users || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchJoinedSessions();
    }, []);

    useEffect(() => {
        if (sessionId) fetchSession(sessionId);
    }, [sessionId]);

    if (!currentSession) return <p>Loading session...</p>;

    return (
        <div style={containerStyle}>
            {/* Left Pane: session navigator */}
            <div style={navigatorStyle}>
                <button
                    style={backButtonStyle}
                    onClick={() => navigate('/dashboard')}
                >
                    Back
                </button>

                <h3 style={{ marginTop: '10px', marginBottom: '10px' }}>Your Sessions</h3>
                <ul style={sessionListStyle}>
                    {sessions.map(s => (
                        <li
                            key={s.id}
                            style={{
                                ...sessionItemStyle,
                                backgroundColor: s.id === currentSession.id ? '#1976d2' : 'transparent',
                                color: s.id === currentSession.id ? 'white' : 'black',
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                if (s.id !== currentSession.id) {
                                    navigate(`/sessions/${s.id}`);
                                }
                            }}
                        >
                            {s.courseCode}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Middle Pane: session info & participants */}
            <div style={infoPaneStyle}>
                <h2>{currentSession.courseCode}</h2>
                <p><b>Topics:</b> {currentSession.topics}</p>
                <p><b>Location:</b> {currentSession.location}</p>
                <p>
                    <b>Time:</b> {new Date(currentSession.startTime).toLocaleString()} - {new Date(currentSession.endTime).toLocaleString()}
                </p>

                <h3>Participants</h3>
                <ul>
                    {participants.map(p => (
                        <li key={p.id}>{p.name}</li>
                    ))}
                </ul>
            </div>

            {/* Right Pane: chat */}
            <div style={chatPaneStyle}>
                <SessionChat sessionId={currentSession.id} />
            </div>
        </div>
    );
}

// --- Styles ---
const containerStyle = {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden'
};

const navigatorStyle = {
    width: '200px',
    borderRight: '1px solid gray',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f1f1f1',
    overflowY: 'auto'
};

const backButtonStyle = {
    padding: '8px 12px',
    marginBottom: '15px',
    cursor: 'pointer',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#1976d2',
    color: 'white'
};

const sessionListStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0
};

const sessionItemStyle = {
    padding: '8px 10px',
    marginBottom: '5px',
    borderRadius: '4px'
};

const infoPaneStyle = {
    flex: 1,
    padding: '20px',
    borderRight: '1px solid gray',
    overflowY: 'auto',
    backgroundColor: '#f9f9f9'
};

const chatPaneStyle = {
    flex: 2,
    padding: '20px',
    overflowY: 'auto',
    backgroundColor: '#fff'
};
