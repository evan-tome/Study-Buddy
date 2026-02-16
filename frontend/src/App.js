import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/MainDashboard';
import SessionDashboard from './components/Dashboard/SessionDashboard';
import SessionChat from './components/Sessions/SessionChat';
import UserProfile from './components/UserProfile';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/sessions/:sessionId" element={<SessionDashboard />} />
                <Route path="/chat/:sessionId" element={<SessionChat />} />
                <Route path="/users/:userId" element={<UserProfile />} />
            </Routes>
        </Router>
    );
}

export default App;
