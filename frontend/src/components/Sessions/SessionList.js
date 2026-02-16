import React, { useEffect, useState } from 'react';
import API from '../../api/axios';

export default function SessionList({ onSelect }) {
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        API.get('/sessions')
            .then(res => setSessions(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div style={{ marginTop: '20px' }}>
            <h3>Available Sessions</h3>
            {sessions.length === 0 && <p>No sessions found.</p>}
            {sessions.map(s => (
                <div
                    key={s.id}
                    style={{ border: '1px solid gray', padding: 10, marginBottom: 10, cursor: 'pointer' }}
                    onClick={() => onSelect(s.id)}
                >
                    <b>{s.courseCode}</b> - {s.location} | {s.topics || 'No topics'}
                </div>
            ))}
        </div>
    );
}
