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

/**
 * @param {string} id
 */
async function removeContact(id) {
    await deleteData('contacts/' + id);
}

/**
 * @returns {Promise<Contact[]>}
 */
async function renderContactlist() {
    const contacts = await loadContacts();
    contacts.sort((a, b) => a.name.localeCompare(b.name));
    let currentLetter = '';
    let html = '';
    for (const contact of contacts) {
        const letter = contact.name.charAt(0).toUpperCase();
        const activeClass = contact.id === selectedContact?.id ? 'active' : '';
        if (letter !== currentLetter) {
            currentLetter = letter;
            html += getContactLetterTemplate(letter);
        }
        html += getContactItemTemplate(contact, activeClass);
    }
    document.getElementById('contactList').innerHTML = html;
    return contacts;
}

/**
 * Loads the contact list and shows it. Called when the contacts page opens.
 */
async function refreshContacts() {
    await renderContactlist();
}

/**
 * Shows the details of a contact in the right half and marks it in the list.
 * @param {string} id - The id of the contact to show.
 */
async function selectContact(id) {
    const contacts = await loadContacts();
    selectedContact = contacts.find(contact => contact.id === id) || null;
    if (!selectedContact) return;
    document.getElementById('contactDetails').innerHTML = getContactDetailsTemplate(selectedContact);
    showContactDetails();
    await renderContactlist();
}

/**
 * Opens the edit overlay filled with the data of a contact.
 * @param {string} id - The id of the contact to edit.
 */
async function editContact(id) {
    const contacts = await loadContacts();
    const contact = contacts.find(item => item.id === id);
    if (contact) openEditContactOverlay(contact);
}

/**
 * Deletes a contact, clears its details and shows the updated list.
 * @param {string} id - The id of the contact to delete.
 */
async function deleteContact(id) {
    await removeContact(id);
    selectedContact = null;
    document.getElementById('contactDetails').innerHTML = '';
    hideContactDetails();
    await renderContactlist();
}
