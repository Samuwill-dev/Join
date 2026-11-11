const SESSION_KEY = 'joinUser';


function setSession(user) {
    const sessionUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        color: user.color,
        isGuest: user.isGuest === true
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
}


function getSession() {
    const stored = sessionStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
}


function clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
}


function createGuestUser() {
    return { id: 'guest', name: 'Guest', email: '', isGuest: true };
}
