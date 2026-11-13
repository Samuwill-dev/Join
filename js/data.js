const BASE_URL = 'https://join-b2fa2-default-rtdb.firebaseio.com/';
const USER_COLORS = [
    '#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8',
    '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FFC701',
    '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B'
];


async function fetchJson(path, options) {
    const response = await fetch(BASE_URL + path + '.json', options);
    if (!response.ok) throw new Error('Request failed: ' + response.status);
    return await response.json();
}


async function getData(path) {
    return await fetchJson(path);
}


async function postData(path, data) {
    return await fetchJson(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}


function objectToArray(data) {
    if (!data) return [];
    return Object.entries(data).map(([id, entry]) => ({ ...entry, id }));
}


async function loadUsers() {
    return objectToArray(await getData('users'));
}


async function addUser(user) {
    const result = await postData('users', user);
    return { ...user, id: result.name };
}


async function findUserByEmail(email) {
    const users = await loadUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
}


function getRandomColor() {
    return USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
}


function getInitials(name) {
    const words = name.trim().split(/\s+/);
    const first = words[0][0];
    const last = words.length > 1 ? words[words.length - 1][0] : '';
    return (first + last).toUpperCase();
}
