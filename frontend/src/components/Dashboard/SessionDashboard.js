import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../../api/axios';
import SessionChat from '../Sessions/SessionChat';
import { jwtDecode } from 'jwt-decode';
import { getSessionTimeStatus } from '../../utils/sessionTime';
import { IconLocation, IconLink, IconClock, IconTopic, IconUsers } from '../Icons';
import './SessionDashboard.css';

export default function SessionDashboard() {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = token ? jwtDecode(token) : null;

    const [sessions, setSessions] = useState([]);
    const [currentSession, setCurrentSession] = useState(null);
    const [participants, setParticipants] = useState([]);

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

    if (!sessionId) {
        return (
            <div className="session-dashboard">
                <div className="session-dashboard-sidebar">
                    <button type="button" className="session-dashboard-back" onClick={() => navigate('/dashboard')}>
                        ← Back to dashboard
                    </button>
                    <h3>Your sessions</h3>
                    <ul className="session-dashboard-list">
                        {sessions.map(s => (
                            <li key={s.id} onClick={() => navigate(`/sessions/${s.id}`)}>
                                {s.courseCode}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="session-dashboard-main session-dashboard-loading">
                    Select a session to open chat
                </div>
            </div>
        );
    }

    if (!currentSession) {
        return (
            <div className="session-dashboard">
                <div className="session-dashboard-sidebar">
                    <button type="button" className="session-dashboard-back" onClick={() => navigate('/dashboard')}>
                        ← Back to dashboard
                    </button>
                    <h3>Your sessions</h3>
                    <ul className="session-dashboard-list">
                        {sessions.map(s => (
                            <li key={s.id} onClick={() => navigate(`/sessions/${s.id}`)}>
                                {s.courseCode}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="session-dashboard-main session-dashboard-loading">
                    Loading session…
                </div>
            </div>
        );
    }

    return (
        <div className="session-dashboard">
            <aside className="session-dashboard-sidebar">
                <button type="button" className="session-dashboard-back" onClick={() => navigate('/dashboard')}>
                    ← Back to dashboard
                </button>
                <h3>Your sessions</h3>
                <ul className="session-dashboard-list">
                    {sessions.map(s => (
                        <li
                            key={s.id}
                            className={s.id === currentSession.id ? 'active' : ''}
                            onClick={() => s.id !== currentSession.id && navigate(`/sessions/${s.id}`)}
                        >
                            {s.courseCode}
                        </li>
                    ))}
                </ul>
            </aside>

            <main className="session-dashboard-main">
                <header className="session-dashboard-header">
                    <h1>{currentSession.courseCode}</h1>
                    <div className="session-dashboard-header-meta">
                        {participants.length > 0 && (
                            <span>{participants.length} participant{participants.length !== 1 ? 's' : ''}</span>
                        )}
                    </div>
                </header>

                <div className="session-dashboard-body">
                    <aside className="session-dashboard-info-pane">
                        <div className="info-block">
                            <h3>Details</h3>
                            <div className="info-row session-dashboard-status-row">
                                <strong>Status</strong>
                                <span className={`session-dashboard-status session-dashboard-status--${getSessionTimeStatus(currentSession.startTime, currentSession.endTime).status}`}>
                                    {getSessionTimeStatus(currentSession.startTime, currentSession.endTime).label}
                                </span>
                            </div>
                            <div className="info-row info-row--with-icon">
                                <span className="info-row-icon" aria-hidden="true">
                                    {currentSession.sessionType === 'online' ? <IconLink size={24} /> : <IconLocation size={24} />}
                                </span>
                                <div>
                                    <strong>Type</strong>
                                    {currentSession.sessionType === 'online' ? (
                                        currentSession.meetingLink ? (
                                            <a href={currentSession.meetingLink} target="_blank" rel="noopener noreferrer">Online – Join link</a>
                                        ) : (
                                            'Online'
                                        )
                                    ) : (
                                        'In person'
                                    )}
                                </div>
                            </div>
                            <div className="info-row info-row--with-icon">
                                <span className="info-row-icon" aria-hidden="true"><IconLocation size={24} /></span>
                                <div>
                                    <strong>Location</strong>
                                    {currentSession.location}
                                </div>
                            </div>
                            <div className="info-row info-row--with-icon">
                                <span className="info-row-icon" aria-hidden="true"><IconClock size={24} /></span>
                                <div>
                                    <strong>Time</strong>
                                    {new Date(currentSession.startTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}{' '}
                                    {new Date(currentSession.startTime).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                                    – {new Date(currentSession.endTime).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                                </div>
                            </div>
                            {currentSession.topics && (
                                <div className="info-row info-row--with-icon">
                                    <span className="info-row-icon" aria-hidden="true"><IconTopic size={24} /></span>
                                    <div>
                                        <strong>Topics</strong>
                                        {currentSession.topics}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="info-block">
                            <h3>Participants</h3>
                            <ul className="session-dashboard-participants">
                                {participants.map(p => (
                                    <li key={p.id}>
                                        <Link to={`/users/${p.id}`}>
                                            <IconUsers size={20} className="participant-list-icon" />
                                            {p.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    <div className="session-dashboard-chat-wrap">
                        <SessionChat sessionId={currentSession.id} sessionName={currentSession.courseCode} />
                    </div>
                </div>
            </main>
        </div>
    );
}
