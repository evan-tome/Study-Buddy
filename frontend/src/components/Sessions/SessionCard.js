import React from 'react';

export default function SessionCard({ session, joined, onJoin, onLeave, onOpenChat }) {
    return (
        <div
            style={cardStyle}
            onClick={(e) => {
                // Prevent clicking on buttons from triggering the card click
                if (e.target.tagName !== 'BUTTON') {
                    onOpenChat(session.id);
                }
            }}
        >
            <h3>{session.courseCode}</h3>
            <p><b>Topic:</b> {session.topics}</p>
            <p><b>Location:</b> {session.location}</p>
            <p>
                <b>Time:</b> {new Date(session.startTime).toLocaleString()} - {new Date(session.endTime).toLocaleString()}
            </p>

            <div style={{ marginTop: '10px' }}>
                {joined ? (
                    <>
                        <button style={buttonStyle} onClick={() => onLeave(session.id)}>Leave</button>
                    </>
                ) : (
                    <button style={buttonStyle} onClick={() => onJoin(session.id)}>Join</button>
                )}
            </div>
        </div>
    );
}

const cardStyle = {
    border: '1px solid gray',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '15px',
    backgroundColor: '#f9f9f9',
    boxShadow: '2px 2px 5px rgba(0,0,0,0.1)',
    cursor: 'pointer' // shows it's clickable
};

const buttonStyle = {
    padding: '8px 12px',
    marginRight: '8px',
    cursor: 'pointer',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#1976d2',
    color: 'white'
};
