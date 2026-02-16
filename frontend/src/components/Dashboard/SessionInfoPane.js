import React from 'react';

export default function SessionInfoPane({ session, participants }) {
    if (!session) return <div style={{ padding: '20px' }}>Select a session to see details</div>;

    return (
        <div style={{ width: '300px', borderRight: '1px solid #ddd', padding: '20px', boxSizing: 'border-box' }}>
            <h2>{session.courseCode}</h2>
            <p><b>Location:</b> {session.location}</p>
            <p><b>Start:</b> {session.startTime}</p>
            <p><b>End:</b> {session.endTime}</p>
            <h3>Participants</h3>
            <ul>
                {participants.map(p => <li key={p.id}>{p.name}</li>)}
            </ul>
        </div>
    );
}
