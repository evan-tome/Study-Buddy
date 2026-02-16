import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import './UserProfile.css';

export default function UserProfile() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;
        API.get(`/users/${userId}`)
            .then(res => {
                if (!cancelled) setUser(res.data);
            })
            .catch(err => {
                if (!cancelled) setError(err.response?.data?.message || 'Could not load profile');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, [userId]);

    if (loading) {
        return (
            <div className="user-profile">
                <div className="user-profile-container">
                    <p className="user-profile-loading">Loading profile…</p>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="user-profile">
                <div className="user-profile-container">
                    <p className="user-profile-error">{error || 'User not found'}</p>
                    <button type="button" className="user-profile-back" onClick={() => navigate(-1)}>
                        Go back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="user-profile">
            <div className="user-profile-container">
                <button type="button" className="user-profile-back" onClick={() => navigate(-1)}>
                    ← Back
                </button>

                <div className="user-profile-avatar">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <h1 className="user-profile-name">{user.name}</h1>

                <div className="user-profile-details">
                    {user.program && (
                        <div className="user-profile-row">
                            <strong>Program</strong>
                            <span>{user.program}</span>
                        </div>
                    )}
                    {user.year != null && user.year !== '' && (
                        <div className="user-profile-row">
                            <strong>Year</strong>
                            <span>{user.year}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
