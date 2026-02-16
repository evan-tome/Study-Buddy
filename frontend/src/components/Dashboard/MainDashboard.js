import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import SessionCard from '../Sessions/SessionCard';
import SessionCreate from '../Sessions/SessionCreate';
import { jwtDecode } from 'jwt-decode'; // default import

export default function Dashboard() {
    const token = localStorage.getItem('token');
    const user = token ? jwtDecode(token) : null;
    const navigate = useNavigate();

    const [allSessions, setAllSessions] = useState([]);
    const [joinedSessions, setJoinedSessions] = useState([]);
    const [filter, setFilter] = useState('');
    const [showCreate, setShowCreate] = useState(false);

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

    // Leave session
    const handleLeave = async (sessionId) => {
        try {
            await API.post(`/sessions/${sessionId}/leave`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchJoinedSessions();
        } catch (err) {
            console.error(err);
        }
    };

    // Open session dashboard
    const handleOpenSession = (sessionId) => {
        navigate(`/sessions/${sessionId}`);
    };

    // Filtered sessions
    const filteredSessions = allSessions.filter(s =>
        s.courseCode.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div style={{ padding: '20px' }}>
            <h2>Dashboard</h2>

            <div style={{ margin: '15px 0' }}>
                <input
                    placeholder="Filter by course code"
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    style={{ padding: '8px', width: '250px', marginRight: '10px' }}
                />
                <button
                    style={{ padding: '8px 12px', cursor: 'pointer' }}
                    onClick={() => setShowCreate(!showCreate)}
                >
                    {showCreate ? 'Close' : 'Create Session'}
                </button>
            </div>

            {showCreate && (
                <SessionCreate onCreated={() => {
                    setShowCreate(false);
                    fetchAllSessions();
                    fetchJoinedSessions();
                }} />
            )}

            <h3>Joined Sessions</h3>
            {joinedSessions.length === 0 && <p>You haven't joined any sessions.</p>}
            {joinedSessions.map(session => (
                <SessionCard
                    key={session.id}
                    session={session}
                    joined={true}
                    onJoin={handleJoin}
                    onLeave={handleLeave}
                    onOpenChat={handleOpenSession} // navigate to session dashboard
                />
            ))}

            <h3>All Sessions</h3>
            {filteredSessions.length === 0 && <p>No sessions found.</p>}
            {filteredSessions.map(session => {
                const joined = joinedSessions.some(js => js.id === session.id);
                return (
                    <SessionCard
                        key={session.id}
                        session={session}
                        joined={joined}
                        onJoin={handleJoin}
                        onLeave={handleLeave}
                        onOpenChat={handleOpenSession} // navigate to session dashboard
                    />
                );
            })}
        </div>
    );
}
