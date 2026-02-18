import { useState, useEffect } from 'react';
import API from '../../api/axios';
import './SessionEdit.css';

function toLocalDateTime(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function SessionEdit({ session, onSaved, onCancel, inline }) {
    const [form, setForm] = useState({
        courseCode: '',
        location: '',
        startTime: '',
        endTime: '',
        topics: '',
        maxParticipants: 10,
        sessionType: 'in_person',
        meetingLink: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (session) {
            setForm({
                courseCode: session.courseCode || '',
                location: session.location || '',
                startTime: toLocalDateTime(session.startTime),
                endTime: toLocalDateTime(session.endTime),
                topics: session.topics || '',
                maxParticipants: session.maxParticipants ?? 10,
                sessionType: session.sessionType === 'online' ? 'online' : 'in_person',
                meetingLink: session.meetingLink || ''
            });
        }
    }, [session]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: name === 'maxParticipants' ? parseInt(value, 10) || 10 : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);
        try {
            await API.put(`/sessions/${session.id}`, {
                ...form,
                maxParticipants: Number(form.maxParticipants) || 10,
                sessionType: form.sessionType,
                meetingLink: form.sessionType === 'online' ? form.meetingLink : undefined
            });
            if (onSaved) onSaved();
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to update session');
        } finally {
            setLoading(false);
        }
    };

    if (!session) return null;

    const formContent = (
        <form className="edit-form" onSubmit={handleSubmit}>
            <h3 className="edit-form-title">Edit Session</h3>

            <label className="edit-form-label edit-form-label--full">
                Course Code
                <input
                    className="edit-form-input"
                    name="courseCode"
                    value={form.courseCode}
                    onChange={handleChange}
                    required
                />
            </label>

            <label className="edit-form-label edit-form-label--full">
                Location
                <input
                    className="edit-form-input"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    required
                />
            </label>

            <div className="edit-form-label edit-form-label--full">
                Type
                <div className="edit-form-radio-group">
                    <label className="edit-form-radio">
                        <input
                            name="sessionType"
                            type="radio"
                            value="in_person"
                            checked={form.sessionType === 'in_person'}
                            onChange={handleChange}
                        />
                        In person
                    </label>
                    <label className="edit-form-radio">
                        <input
                            name="sessionType"
                            type="radio"
                            value="online"
                            checked={form.sessionType === 'online'}
                            onChange={handleChange}
                        />
                        Online
                    </label>
                </div>
            </div>

            {form.sessionType === 'online' && (
                <label className="edit-form-label edit-form-label--full">
                    Meeting Link
                    <input
                        className="edit-form-input"
                        type="url"
                        name="meetingLink"
                        value={form.meetingLink}
                        onChange={handleChange}
                    />
                </label>
            )}

            <div className="edit-form-row edit-form-row--double">
                <label className="edit-form-label">
                    Start Time
                    <input
                        className="edit-form-input"
                        type="datetime-local"
                        name="startTime"
                        value={form.startTime}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label className="edit-form-label">
                    End Time
                    <input
                        className="edit-form-input"
                        type="datetime-local"
                        name="endTime"
                        value={form.endTime}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>

            <label className="edit-form-label edit-form-label--full">
                Topics
                <input
                    className="edit-form-input"
                    name="topics"
                    value={form.topics}
                    onChange={handleChange}
                />
            </label>

            <label className="edit-form-label">
                Max Participants
                <input
                    className="edit-form-input edit-form-input--narrow"
                    type="number"
                    min={1}
                    name="maxParticipants"
                    value={form.maxParticipants}
                    onChange={handleChange}
                />
            </label>

            <div className="edit-form-row edit-form-row--submit">
                <button
                    type="button"
                    className="edit-form-cancel"
                    onClick={onCancel}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="edit-form-submit"
                    disabled={loading}
                >
                    {loading ? 'Saving…' : 'Save changes'}
                </button>
            </div>

            {message && (
                <p
                    className={`edit-form-message ${
                        message.includes('Failed') ? 'edit-form-message--error' : ''
                    }`}
                >
                    {message}
                </p>
            )}
        </form>
    );

    if (inline) return formContent;

    return (
        <div className="session-edit-modal">
            <div className="session-edit-content">{formContent}</div>
        </div>
    );
}
