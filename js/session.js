const SESSION_KEY = 'joinUser';
const LOGIN_PAGE = '../index.html';


/**
 * Saves the logged-in user in the sessionStorage.
 * The password is not saved.
 * @param {User} user - The user who logged in.
 */
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


/**
 * Reads the logged-in user from the sessionStorage.
 * @returns {User|null} The saved user, or null if nobody is logged in.
 */
function getSession() {
    const stored = sessionStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
}


/**
 * Removes the logged-in user from the sessionStorage.
 */
function clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
}


/**
 * Creates the user for the guest login.
 * The guest is only saved in the session, never in Firebase.
 * @returns {User} The guest user.
 */
function createGuestUser() {
    return { id: 'guest', name: 'Guest', email: '', isGuest: true };
}


/**
 * Sends the user back to the login page if nobody is logged in.
 * Call this at the start of every internal page.
 */
function requireLogin() {
    if (!getSession()) window.location.replace(LOGIN_PAGE);
}


/**
 * Logs the user out and opens the login page.
 */
function logout() {
    clearSession();
    window.location.href = LOGIN_PAGE;
}


/**
 * Builds the initials from a name, e.g. "Anna Schmidt" -> "AS".
 * If the name has only one word, it returns one letter.
 * @param {string} name - The full name of the user.
 * @returns {string} One or two capital letters.
 */
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


/**
 * Shows the initials of the logged-in user in the profile button.
 * @param {HTMLElement} profileButton - The profile button in the header.
 */
function renderUserInitials(profileButton) {
    const user = getSession();
    if (user) profileButton.textContent = getInitials(user.name);
}


/**
 * Sets up the user menu in the header: shows the initials and
 * adds the events for opening, closing and logging out.
 */
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


/**
 * Opens the user menu if it is closed, and closes it if it is open.
 * @param {HTMLElement} button - The profile button in the header.
 * @param {HTMLElement} menu - The user menu.
 */
function toggleUserMenu(button, menu) {
    const isOpen = !menu.classList.toggle('d-none');
    button.setAttribute('aria-expanded', isOpen);
}


/**
 * Closes the user menu.
 * @param {HTMLElement} button - The profile button in the header.
 * @param {HTMLElement} menu - The user menu.
 */
function closeUserMenu(button, menu) {
    menu.classList.add('d-none');
    button.setAttribute('aria-expanded', false);
}


/**
 * Closes the user menu when the click was outside the button and the menu.
 * @param {MouseEvent} event - The click event.
 * @param {HTMLElement} button - The profile button in the header.
 * @param {HTMLElement} menu - The user menu.
 */
function closeOnOutsideClick(event, button, menu) {
    const isInside = button.contains(event.target) || menu.contains(event.target);
    if (!isInside) closeUserMenu(button, menu);
}
