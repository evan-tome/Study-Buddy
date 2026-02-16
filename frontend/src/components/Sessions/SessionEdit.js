import { useState, useEffect } from 'react';
import API from '../../api/axios';

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
        <>
            <h3>Edit Session</h3>
            <form onSubmit={handleSubmit}>
                <input name="courseCode" placeholder="Course Code" value={form.courseCode} onChange={handleChange} required />
                <input name="location" placeholder="Location" value={form.location} onChange={handleChange} required />
                <div style={{ marginBottom: 10 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontSize: '0.85rem' }}>Type</label>
                    <label style={{ marginRight: 12 }}>
                        <input name="sessionType" type="radio" value="in_person" checked={form.sessionType === 'in_person'} onChange={handleChange} />
                        In person
                    </label>
                    <label>
                        <input name="sessionType" type="radio" value="online" checked={form.sessionType === 'online'} onChange={handleChange} />
                        Online
                    </label>
                </div>
                {form.sessionType === 'online' && (
                    <input name="meetingLink" type="url" placeholder="Meeting link" value={form.meetingLink} onChange={handleChange} style={{ display: 'block', width: '100%', marginBottom: 10 }} />
                )}
                <input name="startTime" type="datetime-local" value={form.startTime} onChange={handleChange} required />
                <input name="endTime" type="datetime-local" value={form.endTime} onChange={handleChange} required />
                <input name="topics" placeholder="Topics" value={form.topics} onChange={handleChange} />
                <input name="maxParticipants" type="number" min={1} value={form.maxParticipants} onChange={handleChange} />
                <div className="session-edit-actions">
                    <button type="button" onClick={onCancel}>Cancel</button>
                    <button type="submit" disabled={loading}>{loading ? 'Saving…' : 'Save changes'}</button>
                </div>
            </form>
            {message && <p className="session-edit-message">{message}</p>}
        </>
    );

    if (inline) return formContent;

    return (
        <div className="session-edit-modal">
            <div className="session-edit-content">
                {formContent}
            </div>
        </div>
    );
}
