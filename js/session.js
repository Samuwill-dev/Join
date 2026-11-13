const SESSION_KEY = 'joinUser';
const LOGIN_PAGE = '../index.html';


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


function requireLogin() {
    if (!getSession()) window.location.replace(LOGIN_PAGE);
}


function logout() {
    clearSession();
    window.location.href = LOGIN_PAGE;
}


function getInitials(name) {
    const words = name.trim().split(/\s+/);
    const first = words[0][0];
    let last;
    if (words.length > 1) {
        last = words[words.length - 1][0];
    } else {
        last = '';
    }
    return (first + last).toUpperCase();
}


function renderUserInitials(profileButton) {
    const user = getSession();
    if (user) profileButton.textContent = getInitials(user.name);
}
