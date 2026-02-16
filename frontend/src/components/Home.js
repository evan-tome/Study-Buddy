import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <div className="home-content">
                <h1>Study Buddy</h1>
                <p>
                    Connect with students at your university, create or join study sessions,
                    and chat in real-time to collaborate effectively.
                </p>
                <div className="home-buttons">
                    <button className="btn login-btn" onClick={() => navigate('/login')}>
                        Login
                    </button>
                    <button className="btn register-btn" onClick={() => navigate('/register')}>
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
}
