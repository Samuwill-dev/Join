/**
 * @typedef {Object} Contact
 * @typedef {string} [id] -
 * 
 * @property {string} name - The name of the contact.
 * @property {string} email - The email address of the contact.
 * @property {string} phone - The phone number of the contact.
 */

let selectedContact = null;

/**
 * @returns {Promise<Contact[]>}
 */

async function loadContacts() {
    const contacts = objectToArray(await getData('contacts'));
    for (const contact of contacts) {
        if (!contact.phone) contact.phone = '';
    }
    return contacts;
}

/**
 * @param {Contact} contact
 * @returns {Promise<Contact>}
 */
async function addContact(contact) {
    const newContact = removeId(contact);
    const result = await postData('contacts', newContact);
    return { ...newContact, id: result.name };
}

/**
 * @param {string} id
 * @param {Object} changes
 */ 
async function updateContact(id, changes) {
    await patchData('contacts/'+ id, removeId(changes));
}

