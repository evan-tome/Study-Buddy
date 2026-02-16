import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconSparkles } from './Icons';
import './Home.css';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="home-page">
            <div className="home-content">
                <div className="home-icon-wrap">
                    <IconSparkles size={56} />
                </div>
                <h1 className="home-title">Study Buddy</h1>
                <p className="home-tagline">
                    Connect with students at your university, create or join study sessions,
                    and chat in real-time to collaborate effectively.
                </p>
                <div className="home-buttons">
                    <button type="button" className="home-btn home-btn--primary" onClick={() => navigate('/login')}>
                        Sign in
                    </button>
                    <button type="button" className="home-btn home-btn--secondary" onClick={() => navigate('/register')}>
                        Create account
                    </button>
                </div>
            </div>
        </div>
    );
}
