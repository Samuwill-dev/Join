/**
 * Returns the HTML for a letter above a group of contacts, e.g. "A".
 * @param {string} letter - The first letter of the contacts below.
 * @returns {string} The HTML of the letter with the line below.
 */
function getContactLetterTemplate(letter) {
    return `<div class="contact-letter">${letter}</div>`;
}


/**
 * Returns the HTML for one contact in the list.
 * A click on it calls selectContact(id), which the contact logic provides.
 * @param {{id: string, name: string, email: string, color: string}} contact - The contact to show.
 * @param {string} activeClass - "active" if the contact is selected, otherwise "".
 * @returns {string} The HTML of the contact.
 */
function getContactItemTemplate(contact, activeClass) {
    return `
        <button class="contact-item ${activeClass}" onclick="selectContact('${contact.id}')">
            <span class="contact-avatar" style="background-color: ${contact.color}">${getInitials(contact.name)}</span>
            <span class="contact-info">
                <span class="contact-name">${contact.name}</span>
                <span class="contact-email">${contact.email}</span>
            </span>
        </button>`;
}


/**
 * Returns the HTML for the details of the selected contact.
 * Edit and Delete call editContact(id) and deleteContact(id), which the contact logic provides.
 * @param {{id: string, name: string, email: string, phone: string, color: string}} contact - The contact to show.
 * @returns {string} The HTML of the details.
 */
function getContactDetailsTemplate(contact) {
    return `
        <div class="contact-details-head">
            <span class="contact-details-avatar" style="background-color: ${contact.color}">${getInitials(contact.name)}</span>
            <div class="contact-details-title">
                <h2>${contact.name}</h2>
                ${getContactActionsTemplate(contact.id)}
            </div>
        </div>
        <h3>Contact Information</h3>
        ${getContactInfoTemplate(contact)}`;
}


/**
 * Returns the HTML for the Edit and Delete buttons in the details.
 * @param {string} id - The id of the contact.
 * @returns {string} The HTML of both buttons.
 */
function getContactActionsTemplate(id) {
    return `
        <div class="contact-actions">
            <button class="contact-action" onclick="editContact('${id}')">
                <span class="contact-action-icon icon-edit"></span>
                Edit
            </button>
            <button class="contact-action" onclick="deleteContact('${id}')">
                <span class="contact-action-icon icon-delete"></span>
                Delete
            </button>
        </div>`;
}


/**
 * Returns the HTML for the email and the phone number in the details.
 * The phone number is optional, so it can be "".
 * @param {{email: string, phone: string}} contact - The contact to show.
 * @returns {string} The HTML of the contact information.
 */
function getContactInfoTemplate(contact) {
    return `
        <div class="contact-details-info">
            <h4>Email</h4>
            <a class="contact-email" href="mailto:${contact.email}">${contact.email}</a>
            <h4>Phone</h4>
            <p class="contact-phone">${contact.phone}</p>
        </div>`;
}
