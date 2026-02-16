import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [program, setProgram] = useState('');
    const [year, setYear] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const res = await API.post('/auth/register', {
                name, email, password, program, year
            });

            setSuccess('Registration successful! You can now login.');
            // Redirect to login after a short delay
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            console.error(err);
            if (err.response) {
                setError(err.response.data.message || 'Registration failed');
            } else {
                setError('Network or server error');
            }
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '50px auto' }}>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
                />
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
                <input
                    type="text"
                    placeholder="Program"
                    value={program}
                    onChange={e => setProgram(e.target.value)}
                    required
                    style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
                />
                <input
                    type="text"
                    placeholder="Year"
                    value={year}
                    onChange={e => setYear(e.target.value)}
                    required
                    style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
                />
                <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>Register</button>
            </form>
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}
        </div>
    );
}
