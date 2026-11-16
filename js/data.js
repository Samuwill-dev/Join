const BASE_URL = 'https://join-b2fa2-default-rtdb.firebaseio.com/';
const USER_COLORS = [
    '#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8',
    '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FFC701',
    '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B'
];


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
    return await sendData('POST', path, data);
}


/**
 * Changes only the given fields of an entry in Firebase.
 * All other fields stay the same.
 * @param {string} path - The path of the entry, e.g. "tasks/-Nx9b".
 * @param {Object} data - The fields to change.
 * @returns {Promise<Object>} The changed fields.
 */
async function patchData(path, data) {
    return await sendData('PATCH', path, data);
}


/**
 * Deletes an entry in Firebase.
 * @param {string} path - The path of the entry, e.g. "tasks/-Nx9b".
 * @returns {Promise<null>} Firebase answers with null.
 */
async function deleteData(path) {
    return await fetchJson(path, { method: 'DELETE' });
}


/**
 * Sends data as JSON to Firebase. Used by postData and patchData.
 * @param {string} method - The request method, e.g. "POST" or "PATCH".
 * @param {string} path - The path in the database.
 * @param {Object} data - The data to send.
 * @returns {Promise<any>} The answer from Firebase.
 */
async function sendData(method, path, data) {
    return await fetchJson(path, {
        method: method,
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
 * Returns a copy of the data without the "id" field.
 * @param {Object} data - The data with or without id.
 * @returns {Object} The data without id.
 */
function removeId(data) {
    const { id, ...rest } = data;
    return rest;
}


/**
 * Picks a random avatar color, e.g. for a new user or contact.
 * @returns {string} A color from USER_COLORS, e.g. "#FF7A00".
 */
function getRandomColor() {
    return USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
}
