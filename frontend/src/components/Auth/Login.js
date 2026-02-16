import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await API.post('/auth/login', { email, password });
            const { token } = res.data;

            // Store token in localStorage
            localStorage.setItem('token', token);

            // Navigate to dashboard
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            if (err.response) {
                setError(err.response.data.message || 'Login failed');
            } else {
                setError('Network or server error');
            }
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '50px auto' }}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
                />
                <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>Login</button>
            </form>
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </div>
    );
}
