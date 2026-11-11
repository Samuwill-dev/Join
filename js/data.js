const BASE_URL = 'https://join-b2fa2-default-rtdb.firebaseio.com/';


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
