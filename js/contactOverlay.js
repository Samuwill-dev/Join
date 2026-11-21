const CONTACT_FIELDS = ['contactName', 'contactEmail', 'contactPhone'];
const OVERLAY_ANIMATION_TIME = 400; // same as the transition in contactOverlay.css
const PHONE_PATTERN = /^\+?\d[\d ]{4,}\d$/;


/**
 * Sets up the contact overlay: open and close buttons, backdrop, Esc key and form.
 */
function initContactOverlay() {
    const overlay = document.getElementById('contactOverlay');
    document.getElementById('contactAddBtn').addEventListener('click', openContactOverlay);
    document.getElementById('overlayCloseBtn').addEventListener('click', closeContactOverlay);
    document.getElementById('overlayCancelBtn').addEventListener('click', closeContactOverlay);
    overlay.addEventListener('click', closeOnBackdropClick);
    overlay.addEventListener('cancel', handleOverlayCancel);
    document.getElementById('contactForm').addEventListener('submit', handleContactSubmit);
    clearErrorsOnInput(CONTACT_FIELDS);
}


/**
 * Opens the contact overlay with an empty form and lets it slide in.
 */
function openContactOverlay() {
    const overlay = document.getElementById('contactOverlay');
    resetContactForm();
    overlay.showModal();
    requestAnimationFrame(() => overlay.classList.add('overlay-visible'));
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
    saveContactFromForm(values);
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
 * Hands the checked values over to the contact logic and closes the overlay.
 * The contact logic adds the saving here, e.g. with a function from contactData.js.
 * @param {{name: string, email: string, phone: string}} values - The checked values.
 */
function saveContactFromForm(values) {
    closeContactOverlay();
}
