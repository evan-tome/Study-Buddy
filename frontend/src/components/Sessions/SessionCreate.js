import { useState } from 'react';
import API from '../../api/axios';
import './SessionCreate.css';

export default function SessionCreate({ onCreated }) {
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
    const [isError, setIsError] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: name === 'maxParticipants' ? (parseInt(value, 10) || '') : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsError(false);
        setMessage('');
        const payload = {
            ...form,
            maxParticipants: Math.max(1, Number(form.maxParticipants) || 10),
            sessionType: form.sessionType,
            meetingLink: form.sessionType === 'online' ? form.meetingLink : undefined
        };
        try {
            await API.post('/sessions', payload);
            setMessage('Session created!');
            if (onCreated) onCreated();
        } catch (err) {
            setMessage(err.response?.data?.message || 'Error creating session');
            setIsError(true);
        }
    };

    return (
        <form className="session-create-form" onSubmit={handleSubmit}>
            <h3 className="session-create-form-title">New study session</h3>

            <div className="session-create-form-row">
                <label className="session-create-form-label">
                    Course code
                    <input
                        name="courseCode"
                        type="text"
                        placeholder="e.g. CS 101"
                        value={form.courseCode}
                        onChange={handleChange}
                        required
                        className="session-create-form-input"
                    />
                </label>
                <label className="session-create-form-label">
                    Location
                    <input
                        name="location"
                        type="text"
                        placeholder={form.sessionType === 'online' ? 'e.g. Online' : 'e.g. Library room 3'}
                        value={form.location}
                        onChange={handleChange}
                        required
                        className="session-create-form-input"
                    />
                </label>
            </div>

            <div className="session-create-form-row session-create-form-row--full">
                <label className="session-create-form-label">
                    Type
                    <div className="session-create-form-radio-group">
                        <label className="session-create-form-radio">
                            <input
                                name="sessionType"
                                type="radio"
                                value="in_person"
                                checked={form.sessionType === 'in_person'}
                                onChange={handleChange}
                            />
                            <span>In person</span>
                        </label>
                        <label className="session-create-form-radio">
                            <input
                                name="sessionType"
                                type="radio"
                                value="online"
                                checked={form.sessionType === 'online'}
                                onChange={handleChange}
                            />
                            <span>Online</span>
                        </label>
                    </div>
                </label>
            </div>
            {form.sessionType === 'online' && (
                <label className="session-create-form-label session-create-form-label--full">
                    Meeting link
                    <input
                        name="meetingLink"
                        type="url"
                        placeholder="https://meet.google.com/..."
                        value={form.meetingLink}
                        onChange={handleChange}
                        className="session-create-form-input"
                    />
                </label>
            )}

            <div className="session-create-form-row session-create-form-row--double">
                <label className="session-create-form-label">
                    Start
                    <input
                        name="startTime"
                        type="datetime-local"
                        value={form.startTime}
                        onChange={handleChange}
                        required
                        className="session-create-form-input"
                    />
                </label>
                <label className="session-create-form-label">
                    End
                    <input
                        name="endTime"
                        type="datetime-local"
                        value={form.endTime}
                        onChange={handleChange}
                        required
                        className="session-create-form-input"
                    />
                </label>
            </div>

            <label className="session-create-form-label session-create-form-label--full">
                Topics (optional)
                <input
                    name="topics"
                    type="text"
                    placeholder="e.g. Chapter 5, midterm review"
                    value={form.topics}
                    onChange={handleChange}
                    className="session-create-form-input"
                />
            </label>

            <div className="session-create-form-row session-create-form-row--submit">
                <label className="session-create-form-label session-create-form-label--inline">
                    Max participants
                    <input
                        name="maxParticipants"
                        type="number"
                        min={1}
                        max={99}
                        value={form.maxParticipants}
                        onChange={handleChange}
                        className="session-create-form-input session-create-form-input--narrow"
                    />
                </label>
                <button type="submit" className="session-create-form-submit">
                    Create session
                </button>
            </div>

            {message && (
                <p className={`session-create-form-message ${isError ? 'session-create-form-message--error' : ''}`}>
                    {message}
                </p>
            )}
        </form>
    );
}
