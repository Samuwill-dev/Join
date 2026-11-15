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


function initUserMenu() {
    const button = document.getElementById('profileButton');
    const menu = document.getElementById('userMenu');
    renderUserInitials(button);
    button.addEventListener('click', () => toggleUserMenu(button, menu));
    document.getElementById('logoutButton').addEventListener('click', logout);
    document.addEventListener('click', event => closeOnOutsideClick(event, button, menu));
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeUserMenu(button, menu);
    });
}


function toggleUserMenu(button, menu) {
    const isOpen = !menu.classList.toggle('d-none');
    button.setAttribute('aria-expanded', isOpen);
}


function closeUserMenu(button, menu) {
    menu.classList.add('d-none');
    button.setAttribute('aria-expanded', false);
}


function closeOnOutsideClick(event, button, menu) {
    const isInside = button.contains(event.target) || menu.contains(event.target);
    if (!isInside) closeUserMenu(button, menu);
}
