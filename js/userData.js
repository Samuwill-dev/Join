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
