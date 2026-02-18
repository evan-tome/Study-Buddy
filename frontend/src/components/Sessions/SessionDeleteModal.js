import React from 'react';
import './SessionDeleteModal.css';

export default function DeleteSessionModal({ session, onConfirm, onCancel }) {
    if (!session) return null;

    return (
        <div className="delete-modal-backdrop" onClick={onCancel}>
            <div className="delete-modal-content" onClick={e => e.stopPropagation()}>
                <h3>Delete Session</h3>
                <p>
                    Are you sure you want to delete the session <strong>{session.courseCode}</strong>?
                </p>
                <div className="delete-modal-actions">
                    <button className="delete-modal-cancel" onClick={onCancel}>Cancel</button>
                    <button className="delete-modal-confirm" onClick={onConfirm}>Delete</button>
                </div>
            </div>
        </div>
    );
}
