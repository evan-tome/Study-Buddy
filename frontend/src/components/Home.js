import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconSparkles } from './Icons';
import './Home.css';

/* ── Inline SVG icons (no extra dependency) ─────────────────────────────── */

const IconUsers = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
);

const IconCalendar = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
);

const IconMessage = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
);

const IconLock = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
);

const IconChevronDown = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9"/>
    </svg>
);

/* ── Data ───────────────────────────────────────────────────────────────── */

const WHY_CARDS = [
    {
        icon: <IconUsers />,
        title: 'University can feel surprisingly lonely',
        text: 'Lecture halls are big and tutorials are short. Study Buddy gives you a low-pressure way to meet classmates you\'d never otherwise talk to.',
    },
    {
        icon: <IconCalendar />,
        title: 'A reason to reach out',
        text: 'Joining a study session is a natural icebreaker — you already have something in common. No awkward cold introductions required.',
    },
    {
        icon: <IconMessage />,
        title: 'Chat before you meet',
        text: 'Every session has its own group chat so you can get to know people before you even sit down together.',
    },
    {
        icon: <IconLock />,
        title: 'People from your campus only',
        text: 'Study Buddy is scoped to your university. You\'re always connecting with students who share your campus, your courses, and your context.',
    },
];

const FEATURES = [
    {
        title: 'Discover sessions near you',
        desc: 'Browse sessions by course or keyword and see who else is going — get a feel for the group before you commit.',
    },
    {
        title: 'Host your own session',
        desc: 'Post a time and place, write a brief description, and let interested classmates find you.',
    },
    {
        title: 'Group chat for every session',
        desc: 'Break the ice before you meet. Each session has a dedicated chat so introductions happen naturally.',
    },
    {
        title: 'Campus-only community',
        desc: 'Sign up with your university email. Everyone you meet is a verified student at your institution.',
    },
    {
        title: 'Student profiles',
        desc: 'See what courses someone is taking and what sessions they\'ve joined before reaching out.',
    },
    {
        title: 'Notifications',
        desc: 'Get notified when someone joins your session or messages the group so you never miss a connection.',
    },
];

const STEPS = [
    {
        num: '1',
        title: 'Create your account',
        desc: 'Sign up with your university email. Your profile is visible only to students at your institution.',
    },
    {
        num: '2',
        title: 'Find people in your courses',
        desc: 'Browse sessions for your classes and see who\'s already planning to meet up.',
    },
    {
        num: '3',
        title: 'Join, chat, and meet',
        desc: 'Request to join, introduce yourself in the group chat, and show up. That\'s it.',
    },
];

/* ── Component ──────────────────────────────────────────────────────────── */

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="home-page">

            {/* ── Hero ─────────────────────────────────────────────────── */}
            <section className="home-hero">
                <div className="home-content">
                    <div className="home-icon-wrap">
                        <IconSparkles size={56} />
                    </div>
                    <h1 className="home-title">Study Buddy</h1>
                    <p className="home-tagline">
                        The easiest way to meet students at your university.
                        Find people in your courses, join a session, and go from strangers to friends.
                    </p>
                    <div className="home-buttons">
                        <button type="button" className="home-btn home-btn--primary" onClick={() => navigate('/login')}>
                            Sign in
                        </button>
                        <button type="button" className="home-btn home-btn--secondary" onClick={() => navigate('/register')}>
                            Create account
                        </button>
                    </div>
                    <div className="home-scroll-cue">
                        <span>Learn more</span>
                        <IconChevronDown />
                    </div>
                </div>
            </section>

            {/* ── Why Study Buddy ───────────────────────────────────────── */}
            <section className="home-section home-section--alt">
                <div className="home-section-inner">
                    <span className="home-section-label">Why it exists</span>
                    <h2 className="home-section-title">University is big. Making friends shouldn't be hard.</h2>
                    <p className="home-section-subtitle">
                        Most students sit next to the same people every lecture and never learn their names.
                        Study Buddy gives you a structured, low-pressure way to change that.
                    </p>
                    <div className="home-why-grid">
                        {WHY_CARDS.map((card) => (
                            <div className="home-why-card" key={card.title}>
                                <div className="home-why-card__icon">{card.icon}</div>
                                <h3 className="home-why-card__title">{card.title}</h3>
                                <p className="home-why-card__text">{card.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How It Works ─────────────────────────────────────────── */}
            <section className="home-section">
                <div className="home-section-inner">
                    <span className="home-section-label">How it works</span>
                    <h2 className="home-section-title">Meet someone new in three steps</h2>
                    <p className="home-section-subtitle">
                        No complicated setup. Sign up, find people in your courses, and show up.
                    </p>
                    <div className="home-steps">
                        {STEPS.map((step) => (
                            <div className="home-step" key={step.num}>
                                <div className="home-step__num">{step.num}</div>
                                <h3 className="home-step__title">{step.title}</h3>
                                <p className="home-step__desc">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Features ─────────────────────────────────────────────── */}
            <section className="home-section home-section--alt">
                <div className="home-section-inner">
                    <span className="home-section-label">Features</span>
                    <h2 className="home-section-title">Built for making connections, not just cramming</h2>
                    <p className="home-section-subtitle">
                        Every feature is designed to make it easier to find people and start a conversation.
                    </p>
                    <div className="home-features-list">
                        {FEATURES.map((f) => (
                            <div className="home-feature" key={f.title}>
                                <div className="home-feature__dot" />
                                <h3 className="home-feature__title">{f.title}</h3>
                                <p className="home-feature__desc">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ──────────────────────────────────────────────────── */}
            <section className="home-cta">
                <div className="home-cta-inner">
                    <h2 className="home-cta-title">Your next university friend is already on here.</h2>
                    <p className="home-cta-sub">
                        Create a free account with your university email and find someone in your courses today.
                    </p>
                    <div className="home-buttons">
                        <button type="button" className="home-btn home-btn--primary" onClick={() => navigate('/register')}>
                            Get started — it's free
                        </button>
                        <button type="button" className="home-btn home-btn--secondary" onClick={() => navigate('/login')}>
                            Sign in
                        </button>
                    </div>
                </div>
            </section>

            {/* ── Footer ───────────────────────────────────────────────── */}
            <footer className="home-footer">
                © {new Date().getFullYear()} Study Buddy. Made for students.
            </footer>

        </div>
    );
}