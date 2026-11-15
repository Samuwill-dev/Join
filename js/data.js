const BASE_URL = 'https://join-b2fa2-default-rtdb.firebaseio.com/';
const USER_COLORS = [
    '#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8',
    '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FFC701',
    '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B'
];


/**
 * @typedef {Object} User
 * @property {string} id - The Firebase key, or "guest".
 * @property {string} name - First and last name.
 * @property {string} email - The email address.
 * @property {string} [password] - Only in Firebase, never in the session.
 * @property {string} [color] - Color of the avatar.
 * @property {boolean} [isGuest] - True for the guest login.
 */


/**
 * Sends a request to Firebase and returns the answer as an object.
 * @param {string} path - The path in the database, e.g. "users".
 * @param {RequestInit} [options] - Extra fetch options, e.g. method and body.
 * @returns {Promise<any>} The data from Firebase.
 * @throws {Error} If the request was not successful.
 */
async function fetchJson(path, options) {
    const response = await fetch(BASE_URL + path + '.json', options);
    if (!response.ok) throw new Error('Request failed: ' + response.status);
    return await response.json();
}


/**
 * Loads data from Firebase.
 * @param {string} path - The path in the database, e.g. "users".
 * @returns {Promise<any>} The data from Firebase, or null if the path is empty.
 */
async function getData(path) {
    return await fetchJson(path);
}


/**
 * Saves new data in Firebase. Firebase creates a new key for it.
 * @param {string} path - The path in the database, e.g. "users".
 * @param {Object} data - The data to save.
 * @returns {Promise<{name: string}>} The answer from Firebase with the new key.
 */
async function postData(path, data) {
    return await fetchJson(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}


/**
 * Turns a Firebase object into an array.
 * The Firebase key of every entry is saved as "id".
 * @param {Object|null} data - The object from Firebase.
 * @returns {Array<Object>} The entries as an array, or an empty array.
 */
function objectToArray(data) {
    if (!data) return [];
    return Object.entries(data).map(([id, entry]) => ({ ...entry, id }));
}


/**
 * Loads all users from Firebase.
 * @returns {Promise<User[]>} All users as an array.
 */
async function loadUsers() {
    return objectToArray(await getData('users'));
}


/**
 * Saves a new user in Firebase.
 * @param {User} user - The new user without id.
 * @returns {Promise<User>} The saved user with the new id.
 */
async function addUser(user) {
    const result = await postData('users', user);
    return { ...user, id: result.name };
}


/**
 * Searches a user by email. Upper and lower case do not matter.
 * @param {string} email - The email to search for.
 * @returns {Promise<User|undefined>} The user, or undefined if nobody has this email.
 */
async function findUserByEmail(email) {
    const users = await loadUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
}


/**
 * Picks a random color for a new user.
 * @returns {string} A color from USER_COLORS, e.g. "#FF7A00".
 */
function getRandomColor() {
    return USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
}
