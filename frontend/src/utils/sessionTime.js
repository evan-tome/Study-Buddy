/**
 * Returns whether the session is currently ongoing (now between start and end).
 */
export function isSessionOngoing(startTime, endTime) {
    const now = Date.now();
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    return now >= start && now <= end;
}

/**
 * Returns 'ended' if session has ended, or a short human string like "Ongoing", "Starts in 5 min", "Tomorrow at 2:00 PM".
 */
export function getSessionTimeStatus(startTime, endTime) {
    const now = Date.now();
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    if (now > end) return { status: 'ended', label: 'Ended' };
    if (now >= start && now <= end) return { status: 'ongoing', label: 'Ongoing' };

    const diff = start - now;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 1) {
        const d = new Date(startTime);
        return { status: 'upcoming', label: d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) };
    }
    if (days === 1) {
        const d = new Date(startTime);
        return { status: 'upcoming', label: `Tomorrow at ${d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}` };
    }
    if (hours >= 1) return { status: 'upcoming', label: `Starts in ${hours} hr${hours !== 1 ? 's' : ''}` };
    if (minutes >= 1) return { status: 'upcoming', label: `Starts in ${minutes} min` };
    return { status: 'upcoming', label: 'Starting soon' };
}
