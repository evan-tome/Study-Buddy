import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import SessionCard from '../Sessions/SessionCard';
import SessionCreate from '../Sessions/SessionCreate';
import SessionEdit from '../Sessions/SessionEdit';
import { jwtDecode } from 'jwt-decode';
import './Dashboard.css';

const TABS = [
  { id: 'discover', label: 'Discover' },
  { id: 'joined', label: 'Joined' },
  { id: 'mine', label: 'My Sessions' },
  { id: 'create', label: 'Create' },
];

export default function Dashboard() {
  const token = localStorage.getItem('token');
  const user = token ? jwtDecode(token) : null;
  const navigate = useNavigate();

  const [allSessions, setAllSessions] = useState([]);
  const [joinedSessions, setJoinedSessions] = useState([]);
  const [search, setSearch] = useState('');
  const [editingSession, setEditingSession] = useState(null);
  const [leaveError, setLeaveError] = useState('');
  const [activeTab, setActiveTab] = useState('discover');

  useEffect(() => {
    fetchAllSessions();
    fetchJoinedSessions();
  }, []);

  const fetchAllSessions = async () => {
    try {
      const res = await API.get('/sessions', { headers: { Authorization: `Bearer ${token}` } });
      setAllSessions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchJoinedSessions = async () => {
    try {
      const res = await API.get('/users/me/sessions', { headers: { Authorization: `Bearer ${token}` } });
      setJoinedSessions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoin = async (sessionId) => {
    try {
      await API.post(`/sessions/${sessionId}/join`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchJoinedSessions();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLeave = async (sessionId) => {
    setLeaveError('');
    try {
      await API.post(`/sessions/${sessionId}/leave`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchAllSessions();
      fetchJoinedSessions();
    } catch (err) {
      setLeaveError(err.response?.data?.message || 'Could not leave session');
    }
  };

  const handleOpenSession = (sessionId) => navigate(`/sessions/${sessionId}`);
  const handleSettings = (session) => setEditingSession(session);
  const handleEditSaved = () => {
    setEditingSession(null);
    fetchAllSessions();
    fetchJoinedSessions();
  };

  const searchLower = search.trim().toLowerCase();
  const matchesSearch = (s) =>
    !searchLower ||
    s.courseCode?.toLowerCase().includes(searchLower) ||
    s.topics?.toLowerCase().includes(searchLower) ||
    s.location?.toLowerCase().includes(searchLower);

  const createdSessions = allSessions.filter((s) => s.creatorId === user?.id);
  const joinedOnly = joinedSessions.filter((js) => !createdSessions.some((c) => c.id === js.id));
  const discoverSessions = allSessions.filter((s) => matchesSearch(s) && s.creatorId !== user?.id);

  const renderTabContent = () => {
    if (activeTab === 'discover') {
      if (!discoverSessions.length) return <p className="empty-state">No sessions found.</p>;
      return (
        <div className="session-cards session-cards--discover">
          {discoverSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              joined={joinedSessions.some((js) => js.id === session.id)}
              onJoin={handleJoin}
              onLeave={handleLeave}
              onOpenChat={handleOpenSession}
            />
          ))}
        </div>
      );
    }

    if (activeTab === 'joined') {
      if (!joinedOnly.length) return <p className="empty-state">No joined sessions.</p>;
      return (
        <div className="session-cards session-cards--list">
          {joinedOnly.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              joined
              onJoin={handleJoin}
              onLeave={handleLeave}
              onOpenChat={handleOpenSession}
            />
          ))}
        </div>
      );
    }

    if (activeTab === 'mine') {
      if (!createdSessions.length) return <p className="empty-state">You haven't created any sessions yet.</p>;
      return (
        <div className="session-cards session-cards--list">
          {createdSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              joined
              isCreator
              onJoin={handleJoin}
              onLeave={handleLeave}
              onOpenChat={handleOpenSession}
              onSettings={handleSettings}
              onDelete={async (sessionId) => {
                try {
                    await API.delete(`/sessions/${sessionId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    fetchAllSessions();
                    fetchJoinedSessions();
                } catch (err) {
                    console.error(err);
                }
            }}
            />
          ))}
        </div>
      );
    }

    if (activeTab === 'create') {
      return (
        <div className="session-create-inline">
          <SessionCreate
            onCreated={() => {
              setActiveTab('joined'); // Automatically go to Joined after creating
              fetchAllSessions();
              fetchJoinedSessions();
            }}
          />
        </div>
      );
    }
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Study Sessions</h1>
        <div className="dashboard-search-bar">
          <input
            type="search"
            placeholder="Search by course, topic, or location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      {leaveError && <p className="dashboard-error">{leaveError}</p>}

      {/* Tabs */}
      <div className="dashboard-tabs-wrapper">
        <nav className="dashboard-tabs">
          {TABS.map((tab) => {
            const count =
              tab.id === 'discover'
                ? discoverSessions.length
                : tab.id === 'joined'
                ? joinedOnly.length
                : tab.id === 'mine'
                ? createdSessions.length
                : null;

            return (
              <button
                key={tab.id}
                className={`dashboard-tab ${activeTab === tab.id ? 'dashboard-tab--active' : ''} ${
                  tab.id === 'create' ? 'dashboard-tab--create' : ''
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
                {count !== null && <span className="tab-count">{count}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Active Tab Content */}
      <div className="dashboard-tab-content">{renderTabContent()}</div>

      {/* Edit Modal */}
      {editingSession && (
        <div className="session-edit-modal" onClick={() => setEditingSession(null)}>
          <div className="session-edit-content" onClick={(e) => e.stopPropagation()}>
            <SessionEdit
              session={editingSession}
              onSaved={handleEditSaved}
              onCancel={() => setEditingSession(null)}
              inline
            />
          </div>
        </div>
      )}

    </div>
  );
}
