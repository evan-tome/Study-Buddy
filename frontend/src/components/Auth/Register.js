import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../api/axios';
import { IconGraduation } from '../Icons';
import './Auth.css';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [program, setProgram] = useState('');
    const [year, setYear] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            await API.post('/auth/register', { name, email, password, program, year });
            setSuccess('Account created! Redirecting to sign in…');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || 'Registration failed');
            } else {
                setError('Network or server error');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-icon-wrap">
                    <IconGraduation size={40} />
                </div>
                <h1>Create account</h1>
                <p className="auth-subtitle">Join Study Buddy to find and host study sessions</p>

                <form className="auth-form" onSubmit={handleRegister}>
                    {error && <div className="auth-error">{error}</div>}
                    {success && <div className="auth-success">{success}</div>}

                    <label htmlFor="reg-name">Name</label>
                    <input
                        id="reg-name"
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        autoComplete="name"
                    />
                    <label htmlFor="reg-email">Email</label>
                    <input
                        id="reg-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />
                    <label htmlFor="reg-password">Password</label>
                    <input
                        id="reg-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                    />
                    <div className="auth-row">
                        <div>
                            <label htmlFor="reg-program">Program</label>
                            <input
                                id="reg-program"
                                type="text"
                                placeholder="e.g. Computer Science"
                                value={program}
                                onChange={e => setProgram(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="reg-year">Year</label>
                            <input
                                id="reg-year"
                                type="text"
                                placeholder="e.g. 2"
                                value={year}
                                onChange={e => setYear(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="auth-submit" disabled={loading}>
                        {loading ? 'Creating account…' : 'Create account'}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
