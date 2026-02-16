import React from 'react';

export default function SessionNavigator({ sessions, selectedSessionId, onSelectSession }) {
    return (
        <div style={{ width: '250px', borderRight: '1px solid #ddd', padding: '10px', boxSizing: 'border-box' }}>
            <h3>Sessions</h3>
            <button onClick={() => onSelectSession(null)}>+ Create Session</button>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {sessions.map(s => (
                    <li 
                        key={s.id} 
                        onClick={() => onSelectSession(s)}
                        style={{ 
                            padding: '8px', 
                            margin: '5px 0', 
                            cursor: 'pointer', 
                            backgroundColor: s.id === selectedSessionId ? '#ddd' : 'transparent',
                            borderRadius: '5px'
                        }}
                    >
                        {s.courseCode}
                    </li>
                ))}
            </ul>
        </div>
    );
}
