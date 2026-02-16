import React from 'react';
import { getSessionTimeStatus } from '../../utils/sessionTime';
import { IconTopic, IconLocation, IconLink, IconClock } from '../Icons';

export default function SessionCard({ session, joined, isCreator, onJoin, onLeave, onOpenChat, onSettings, onDeleteRequest }) {
    const handleCardClick = (e) => {
        if (e.target.closest('button') || e.target.closest('.session-card-actions') || e.target.closest('a')) return;
        if (onOpenChat) onOpenChat(session.id);
    };

    const timeStatus = getSessionTimeStatus(session.startTime, session.endTime);
    const isOnline = session.sessionType === 'online';

    return (
        <div className="session-card" onClick={handleCardClick}>
            <div className="session-card-header">
                <h3>{session.courseCode}</h3>
                <span className={`session-card-badge session-card-badge--${timeStatus.status}`}>
                    {timeStatus.label}
                </span>
            </div>
            <div className="session-card-row">
                <span className="session-card-icon" aria-hidden="true"><IconTopic size={22} /></span>
                <span><strong>Topic:</strong> {session.topics || '—'}</span>
            </div>
            <div className="session-card-row">
                <span className="session-card-icon" aria-hidden="true">
                    {isOnline ? <IconLink size={22} /> : <IconLocation size={22} />}
                </span>
                <span>
                    <strong>{isOnline ? 'Online' : 'Location'}:</strong>{' '}
                    {isOnline && session.meetingLink ? (
                        <a href={session.meetingLink} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                            Join link
                        </a>
                    ) : (
                        session.location
                    )}
                </span>
            </div>
            <div className="session-card-row">
                <span className="session-card-icon" aria-hidden="true"><IconClock size={22} /></span>
                <span>
                    {new Date(session.startTime).toLocaleString()} – {new Date(session.endTime).toLocaleString()}
                </span>
            </div>

            <div className="session-card-actions" onClick={e => e.stopPropagation()}>
                {(joined || isCreator) ? (
                    <button
                        type="button"
                        className="btn-leave"
                        onClick={() => isCreator && onDeleteRequest ? onDeleteRequest(session) : onLeave(session.id)}
                    >
                        {isCreator ? 'Delete session' : 'Leave'}
                    </button>
                ) : (
                    <button type="button" className="btn-join" onClick={() => onJoin(session.id)}>Join</button>
                )}
                {isCreator && onSettings && (
                    <button type="button" className="btn-settings" onClick={() => onSettings(session)}>Settings</button>
                )}
            </div>
        </div>
    );
}
