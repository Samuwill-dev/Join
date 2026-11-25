const CONTACT_FIELDS = ['contactName', 'contactEmail', 'contactPhone'];
const OVERLAY_ANIMATION_TIME = 400; // same as the transition in contactOverlay.css
const PHONE_PATTERN = /^\+?\d[\d ]{4,}\d$/;

let editContactId = null;


/**
 * Sets up the contact overlay: open and close buttons, backdrop, Esc key and form.
 */
function initContactOverlay() {
    const overlay = document.getElementById('contactOverlay');
    document.getElementById('contactAddBtn').addEventListener('click', openAddContactOverlay);
    document.getElementById('overlayDeleteBtn').addEventListener('click', () => deleteContactFromOverlay(editContactId));
    document.getElementById('overlayCloseBtn').addEventListener('click', closeContactOverlay);
    document.getElementById('overlayCancelBtn').addEventListener('click', closeContactOverlay);
    overlay.addEventListener('click', closeOnBackdropClick);
    overlay.addEventListener('cancel', handleOverlayCancel);
    document.getElementById('contactForm').addEventListener('submit', handleContactSubmit);
    clearErrorsOnInput(CONTACT_FIELDS);
}


/**
 * Opens the overlay to add a new contact, with an empty form.
 */
function openAddContactOverlay() {
    editContactId = null;
    resetContactForm();
    setOverlayMode(false);
    setOverlayAvatar(null);
    showContactOverlay();
}


/**
 * Opens the overlay to edit a contact. The form is filled with its data.
 * @param {{id: string, name: string, email: string, phone: string, color: string}} contact - The contact to edit.
 */
function openEditContactOverlay(contact) {
    editContactId = contact.id;
    resetContactForm();
    fillContactForm(contact);
    setOverlayMode(true);
    setOverlayAvatar(contact);
    showContactOverlay();
}


/**
 * Opens the dialog and lets it slide in.
 */
function showContactOverlay() {
    const overlay = document.getElementById('contactOverlay');
    overlay.showModal();
    requestAnimationFrame(() => overlay.classList.add('overlay-visible'));
}


/**
 * Switches the texts and buttons of the overlay between "add" and "edit".
 * @param {boolean} isEdit - True for the edit mode, false for the add mode.
 */
function setOverlayMode(isEdit) {
    let title = 'Add contact';
    if (isEdit) title = 'Edit contact';
    document.getElementById('overlayTitle').textContent = title;
    document.getElementById('overlaySubtitle').classList.toggle('d-none', isEdit);
    document.getElementById('overlayAddButtons').classList.toggle('d-none', isEdit);
    document.getElementById('overlayEditButtons').classList.toggle('d-none', !isEdit);
}


/**
 * Shows the initials in the contact color, or the grey placeholder if there is no contact.
 * @param {{name: string, color: string}|null} contact - The contact, or null for a new contact.
 */
function setOverlayAvatar(contact) {
    const avatar = document.getElementById('overlayAvatar');
    const initials = document.getElementById('overlayAvatarInitials');
    const hasContact = contact !== null;
    avatar.style.backgroundColor = '';
    initials.textContent = '';
    if (hasContact) {
        avatar.style.backgroundColor = contact.color;
        initials.textContent = getInitials(contact.name);
    }
    initials.classList.toggle('d-none', !hasContact);
    document.getElementById('overlayAvatarPlaceholder').classList.toggle('d-none', hasContact);
}


/**
 * Puts the data of a contact into the form fields.
 * @param {{name: string, email: string, phone: string}} contact - The contact to show.
 */
function fillContactForm(contact) {
    document.getElementById('contactName').value = contact.name;
    document.getElementById('contactEmail').value = contact.email;
    document.getElementById('contactPhone').value = '';
    if (contact.phone) document.getElementById('contactPhone').value = contact.phone;
}


/**
 * Lets the contact overlay slide out and closes it after the animation.
 */
function closeContactOverlay() {
    const overlay = document.getElementById('contactOverlay');
    overlay.classList.remove('overlay-visible');
    setTimeout(() => overlay.close(), OVERLAY_ANIMATION_TIME);
}


/**
 * Closes the overlay when the click was on the dark backdrop, not on the box.
 * @param {MouseEvent} event - The click event of the dialog.
 */
function closeOnBackdropClick(event) {
    if (event.target === event.currentTarget) closeContactOverlay();
}


/**
 * Runs when the Esc key is pressed. Closes the overlay with the animation.
 * @param {Event} event - The cancel event of the dialog.
 */
function handleOverlayCancel(event) {
    event.preventDefault();
    closeContactOverlay();
}


/**
 * Empties all fields of the contact form and removes all errors.
 */
function resetContactForm() {
    document.getElementById('contactForm').reset();
    for (const id of CONTACT_FIELDS) {
        clearFieldError(id);
    }
}


/**
 * Runs when the contact form is sent. Checks the inputs and hands them over.
 * @param {SubmitEvent} event - The submit event of the form.
 */
function handleContactSubmit(event) {
    event.preventDefault();
    const values = getContactValues();
    if (!validateContact(values)) return;
    if (editContactId) {
        updateContactFromForm(editContactId, values);
    } else {
        saveContactFromForm(values);
    }
}


/**
 * Reads the values of the contact form.
 * @returns {{name: string, email: string, phone: string}} The cleaned values.
 */
function getContactValues() {
    return {
        name: capitalizeName(cleanUpName(document.getElementById('contactName').value)),
        email: document.getElementById('contactEmail').value.trim(),
        phone: document.getElementById('contactPhone').value.trim()
    };
}


/**
 * Checks the contact inputs and shows errors below the fields.
 * @param {{name: string, email: string, phone: string}} values - The values of the form.
 * @returns {boolean} True if all inputs are valid.
 */
function validateContact(values) {
    const errors = {
        contactName: getContactNameError(values.name),
        contactEmail: getContactEmailError(values.email),
        contactPhone: getContactPhoneError(values.phone)
    };
    let isValid = true;
    for (const id in errors) {
        if (errors[id]) {
            showFieldError(id, errors[id]);
            isValid = false;
        }
    }
    return isValid;
}


/**
 * Returns the error message for the name, or an empty text if it is valid.
 * @param {string} name - The name from the form.
 * @returns {string} The error message or "".
 */
function getContactNameError(name) {
    if (!name) return 'Please enter a name.';
    if (!isValidFullName(name)) return 'Please enter a first and last name.';
    return '';
}


/**
 * Returns the error message for the email, or an empty text if it is valid.
 * @param {string} email - The email from the form.
 * @returns {string} The error message or "".
 */
function getContactEmailError(email) {
    if (!email) return 'Please enter an email.';
    if (!isValidEmail(email)) return 'Please enter a valid email address.';
    return '';
}


/**
 * Returns the error message for the phone number. The phone number is optional.
 * @param {string} phone - The phone number from the form.
 * @returns {string} The error message or "".
 */
function getContactPhoneError(phone) {
    if (!phone) return '';
    if (!PHONE_PATTERN.test(phone)) return 'Please enter a valid phone number.';
    return '';
}


/**
 * Saves a new contact with a random color, closes the overlay and shows the success popup.
 * @param {{name: string, email: string, phone: string}} values - The checked values.
 */
async function saveContactFromForm(values) {
    await addContact({ ...values, color: getRandomColor() });
    closeContactOverlay();
    setTimeout(() => showPopup('contactPopup', POPUP_DURATION), OVERLAY_ANIMATION_TIME);
    await renderContactlist();
}


/**
 * Saves the changed values of a contact, closes the overlay and shows the contact again.
 * The color stays the same.
 * @param {string} id - The id of the edited contact.
 * @param {{name: string, email: string, phone: string}} values - The checked values.
 */
async function updateContactFromForm(id, values) {
    await updateContact(id, values);
    closeContactOverlay();
    await selectContact(id);
}


/**
 * Closes the overlay and deletes the contact.
 * @param {string} id - The id of the contact to delete.
 */
function deleteContactFromOverlay(id) {
    closeContactOverlay();
    deleteContact(id);
}
