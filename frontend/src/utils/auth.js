import { jwtDecode } from 'jwt-decode';

export function getUserInfo() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return { id: decoded.id, name: decoded.name };
    } catch (err) {
        console.error('JWT decode error:', err);
        return null;
    }
}
