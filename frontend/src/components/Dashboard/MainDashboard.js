import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import SessionCard from '../Sessions/SessionCard';
import SessionCreate from '../Sessions/SessionCreate';
import SessionEdit from '../Sessions/SessionEdit';
import { jwtDecode } from 'jwt-decode';
import './Dashboard.css';

export default function Dashboard() {
    const token = localStorage.getItem('token');
    const user = token ? jwtDecode(token) : null;
    const navigate = useNavigate();

    const [allSessions, setAllSessions] = useState([]);
    const [joinedSessions, setJoinedSessions] = useState([]);
    const [search, setSearch] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [leaveError, setLeaveError] = useState('');
    const [editingSession, setEditingSession] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Fetch all sessions
    const fetchAllSessions = async () => {
        try {
            const res = await API.get('/sessions', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAllSessions(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // Fetch sessions user has joined
    const fetchJoinedSessions = async () => {
        try {
            const res = await API.get('/users/me/sessions', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setJoinedSessions(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchAllSessions();
        fetchJoinedSessions();
    }, []);

    // Join session
    const handleJoin = async (sessionId) => {
        try {
            await API.post(`/sessions/${sessionId}/join`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchJoinedSessions();
        } catch (err) {
            console.error(err);
        }
    };

    // Leave session (or delete session if creator)
    const handleLeave = async (sessionId) => {
        setLeaveError('');
        try {
            await API.post(`/sessions/${sessionId}/leave`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAllSessions();
            fetchJoinedSessions();
        } catch (err) {
            const msg = err.response?.data?.message || 'Could not leave session';
            setLeaveError(msg);
        }
    };

    // Open session dashboard
    const handleOpenSession = (sessionId) => {
        navigate(`/sessions/${sessionId}`);
    };

    const handleSettings = (session) => setEditingSession(session);
    const handleEditSaved = () => {
        setEditingSession(null);
        fetchAllSessions();
        fetchJoinedSessions();
    };
    const handleDeleteClick = (session, fromSettings) => {
        setDeleteConfirm({ sessionId: session.id, sessionName: session.courseCode, fromSettings });
    };

    const handleDelete = async (sessionId) => {
        setDeletingId(sessionId);
        try {
            await API.delete(`/sessions/${sessionId}`, { headers: { Authorization: `Bearer ${token}` } });
            setEditingSession(null);
            fetchAllSessions();
            fetchJoinedSessions();
        } catch (err) {
            console.error(err);
        } finally {
            setDeletingId(null);
        }
    };

    const handleConfirmDelete = async () => {
        if (!deleteConfirm) return;
        const { sessionId, fromSettings } = deleteConfirm;
        setDeleteConfirm(null);
        if (fromSettings) {
            await handleDelete(sessionId);
        } else {
            setDeletingId(sessionId);
            try {
                await API.post(`/sessions/${sessionId}/leave`, {}, { headers: { Authorization: `Bearer ${token}` } });
                fetchAllSessions();
                fetchJoinedSessions();
            } catch (err) {
                setLeaveError(err.response?.data?.message || 'Could not delete session');
            } finally {
                setDeletingId(null);
            }
        }
    };

    const searchLower = search.trim().toLowerCase();
    const matchesSearch = (s) => {
        if (!searchLower) return true;
        return (
            (s.courseCode && s.courseCode.toLowerCase().includes(searchLower)) ||
            (s.topics && s.topics.toLowerCase().includes(searchLower)) ||
            (s.location && s.location.toLowerCase().includes(searchLower))
        );
    };
    const createdSessions = allSessions.filter(s => s.creatorId === user?.id);
    const joinedOnly = joinedSessions.filter(js => !createdSessions.some(c => c.id === js.id));
    const discoverSessions = allSessions.filter(s => matchesSearch(s) && s.creatorId !== user?.id);

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Study Sessions</h1>
                <div className="dashboard-search-bar">
                    <input
                        type="search"
                        placeholder="Search by course, topic, or location…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        aria-label="Search sessions"
                    />
                    <button
                        type="button"
                        className={showCreate ? 'btn-secondary' : 'btn-primary'}
                        onClick={() => setShowCreate(!showCreate)}
                    >
                        {showCreate ? 'Cancel' : 'Create session'}
                    </button>
                </div>
            </header>

            {leaveError && (
                <p className="dashboard-error">{leaveError}</p>
            )}

            {showCreate && (
                <div className="session-create-inline">
                    <SessionCreate onCreated={() => {
                        setShowCreate(false);
                        fetchAllSessions();
                        fetchJoinedSessions();
                    }} />
                </div>
            )}

            <section className="dashboard-section">
                <h2>My sessions</h2>
                <div className="session-cards">
                    {createdSessions.length === 0 && (
                        <p className="empty-state">You haven't created any sessions yet. Use &quot;Create session&quot; to add one.</p>
                    )}
                    {createdSessions.map(session => {
                        const joined = joinedSessions.some(js => js.id === session.id);
                        return (
                            <SessionCard
                                key={session.id}
                                session={session}
                                joined={joined}
                                isCreator
                                onJoin={handleJoin}
                                onLeave={handleLeave}
                                onOpenChat={handleOpenSession}
                                onSettings={handleSettings}
                                onDeleteRequest={handleDeleteClick}
                            />
                        );
                    })}
                </div>
            </section>

            <section className="dashboard-section">
                <h2>Joined sessions</h2>
                <div className="session-cards">
                    {joinedOnly.length === 0 && (
                        <p className="empty-state">Sessions you join will appear here.</p>
                    )}
                    {joinedOnly.map(session => (
                        <SessionCard
                            key={session.id}
                            session={session}
                            joined
                            isCreator={session.creatorId === user?.id}
                            onJoin={handleJoin}
                            onLeave={handleLeave}
                            onOpenChat={handleOpenSession}
                            onSettings={session.creatorId === user?.id ? handleSettings : undefined}
                        />
                    ))}
                </div>
            </section>

            <section className="dashboard-section">
                <h2>Discover sessions</h2>
                <div className="session-cards">
                    {discoverSessions.length === 0 && (
                        <p className="empty-state">
                            {search.trim() ? 'No sessions match your search.' : 'No other sessions to show.'}
                        </p>
                    )}
                    {discoverSessions.map(session => {
                        const joined = joinedSessions.some(js => js.id === session.id);
                        return (
                            <SessionCard
                                key={session.id}
                                session={session}
                                joined={joined}
                                onJoin={handleJoin}
                                onLeave={handleLeave}
                                onOpenChat={handleOpenSession}
                            />
                        );
                    })}
                </div>
            </section>

            {deleteConfirm && (
                <div className="confirm-modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="confirm-modal" onClick={e => e.stopPropagation()}>
                        <h3 className="confirm-modal-title">Delete session?</h3>
                        <p className="confirm-modal-message">
                            <strong>{deleteConfirm.sessionName}</strong> and all its messages will be permanently deleted. This cannot be undone.
                        </p>
                        <div className="confirm-modal-actions">
                            <button type="button" className="confirm-modal-cancel" onClick={() => setDeleteConfirm(null)}>
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="confirm-modal-confirm"
                                onClick={handleConfirmDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {editingSession && (
                <div className="session-edit-modal" onClick={() => setEditingSession(null)}>
                    <div className="session-edit-content" onClick={e => e.stopPropagation()}>
                        <SessionEdit
                            session={editingSession}
                            onSaved={handleEditSaved}
                            onCancel={() => setEditingSession(null)}
                            inline
                        />
                        <div className="session-settings-delete">
                            <button
                                type="button"
                                className="btn-delete"
                                disabled={deletingId === editingSession.id}
                                onClick={() => handleDeleteClick(editingSession, true)}
                            >
                                {deletingId === editingSession.id ? 'Deleting…' : 'Delete session'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
