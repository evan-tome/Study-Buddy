import React, { useState } from 'react';
import { getSessionTimeStatus } from '../../utils/sessionTime';
import { IconTopic, IconLocation, IconLink, IconClock } from '../Icons';
import DeleteSessionModal from './SessionDeleteModal';
import './SessionCard.css';

function formatDateRange(startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const optionsDate = { weekday: 'short', day: 'numeric', month: 'short' };
    const optionsTime = { hour: 'numeric', minute: '2-digit', hour12: true };

    const startDateStr = start.toLocaleDateString('en-GB', optionsDate);
    const startTimeStr = start.toLocaleTimeString('en-US', optionsTime);
    const endTimeStr = end.toLocaleTimeString('en-US', optionsTime);

    const sameDay = start.toDateString() === end.toDateString();
    if (sameDay) {
        return `${startDateStr} · ${startTimeStr} – ${endTimeStr}`;
    }

    const endDateStr = end.toLocaleDateString('en-GB', optionsDate);
    return `${startDateStr} ${startTimeStr} – ${endDateStr} ${endTimeStr}`;
}

export default function SessionCard({
    session,
    joined,
    isCreator,
    onJoin,
    onLeave,
    onOpenChat,
    onSettings,
    onDelete // Dashboard passes this for API + refresh
}) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleCardClick = (e) => {
        if (e.target.closest('button') || e.target.closest('.session-card-actions') || e.target.closest('a')) return;
        if (onOpenChat) onOpenChat(session.id);
    };

    const timeStatus = getSessionTimeStatus(session.startTime, session.endTime);
    const isOnline = session.sessionType === 'online';
    const dateRangeStr = formatDateRange(session.startTime, session.endTime);

    const handleDeleteConfirm = async () => {
        if (onDelete) await onDelete(session.id); // call Dashboard handler
        setShowDeleteModal(false);
    };

    return (
        <>
            <div className="session-card" onClick={handleCardClick}>
                <div className="session-card-header">
                    <h3>{session.courseCode}</h3>
                    <span className={`session-card-badge session-card-badge--${timeStatus.status}`}>
                        {timeStatus.label}
                    </span>
                </div>

                <div className="session-card-row">
                    <span className="session-card-icon"><IconTopic size={22} /></span>
                    <span><strong>Topic:</strong> {session.topics || '—'}</span>
                </div>

                <div className="session-card-row">
                    <span className="session-card-icon">{isOnline ? <IconLink size={22} /> : <IconLocation size={22} />}</span>
                    <span>
                        <strong>{isOnline ? 'Online' : 'Location'}:</strong>{' '}
                        {isOnline && session.meetingLink ? (
                            <a
                                href={session.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()}
                            >
                                Join link
                            </a>
                        ) : (
                            session.location || '—'
                        )}
                    </span>
                </div>

                <div className="session-card-row">
                    <span className="session-card-icon"><IconClock size={22} /></span>
                    <span>{dateRangeStr}</span>
                </div>

                <div className="session-card-actions" onClick={e => e.stopPropagation()}>
                    {(joined || isCreator) ? (
                        <button
                            type="button"
                            className="btn-leave"
                            onClick={() =>
                                isCreator ? setShowDeleteModal(true) : onLeave(session.id)
                            }
                        >
                            {isCreator ? 'Delete session' : 'Leave'}
                        </button>
                    ) : (
                        <button type="button" className="btn-join" onClick={() => onJoin(session.id)}>
                            Join
                        </button>
                    )}
                    {isCreator && onSettings && (
                        <button type="button" className="btn-settings" onClick={() => onSettings(session)}>
                            Settings
                        </button>
                    )}
                </div>
            </div>

            {/* Delete confirmation modal */}
            {showDeleteModal && (
                <DeleteSessionModal
                    session={session}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setShowDeleteModal(false)}
                />
            )}
        </>
    );
}
