import { useState } from 'react';
import API from '../../api/axios';

export default function SessionCreate({ onCreated }) {
    const [form, setForm] = useState({
        courseCode: '',
        location: '',
        startTime: '',
        endTime: '',
        topics: '',
        maxParticipants: 10
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/sessions', form);
            setMessage('Session created!');
            if (onCreated) onCreated(res.data.id); // Optional: open chat immediately
        } catch (err) {
            setMessage(err.response?.data?.message || 'Error creating session');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ margin: '20px 0' }}>
            <h3>Create Study Session</h3>
            <input name="courseCode" placeholder="Course Code" onChange={handleChange} required />
            <input name="location" placeholder="Location" onChange={handleChange} required />
            <input name="startTime" type="datetime-local" onChange={handleChange} required />
            <input name="endTime" type="datetime-local" onChange={handleChange} required />
            <input name="topics" placeholder="Topics" onChange={handleChange} />
            <input name="maxParticipants" type="number" onChange={handleChange} min={1} />
            <button type="submit">Create Session</button>
            <p>{message}</p>
        </form>
    );
}
