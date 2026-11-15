const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FULL_NAME_PATTERN = /^\p{L}[\p{L}'-]*( \p{L}[\p{L}'-]*)+$/u;


/**
 * Checks if an email has a valid format, e.g. "name@mail.de".
 * @param {string} email - The email to check.
 * @returns {boolean} True if the format is valid.
 */
function isValidEmail(email) {
    return EMAIL_PATTERN.test(email);
}


/**
 * Checks if a name has a first and a last name.
 * @param {string} name - The name to check.
 * @returns {boolean} True if the name has at least two words.
 */
function isValidFullName(name) {
    return FULL_NAME_PATTERN.test(name);
}


/**
 * Removes spaces at the start and the end, and double spaces in the middle.
 * @param {string} name - The name from the input field.
 * @returns {string} The cleaned name.
 */
function cleanUpName(name) {
    return name.trim().replace(/\s+/g, ' ');
}


/**
 * Makes the first letter of every part of the name a capital letter,
 * e.g. "anna-lena schmidt" -> "Anna-Lena Schmidt".
 * @param {string} name - The name to change.
 * @returns {string} The name with capital letters.
 */
function capitalizeName(name) {
    return name.replace(/(^|[ -])\p{L}/gu, letter => letter.toUpperCase());
}


/**
 * Marks an input field red and shows the error message below it.
 * The error span needs the id of the input + "Error".
 * @param {string} inputId - The id of the input field.
 * @param {string} message - The error message, can be empty.
 */
function showFieldError(inputId, message) {
    const input = document.getElementById(inputId);
    input.closest('.input-group').classList.add('has-error');
    document.getElementById(inputId + 'Error').textContent = message;
}


/**
 * Removes the red mark and the error message of an input field.
 * @param {string} inputId - The id of the input field.
 */
function clearFieldError(inputId) {
    const input = document.getElementById(inputId);
    input.closest('.input-group').classList.remove('has-error');
    document.getElementById(inputId + 'Error').textContent = '';
}


/**
 * Removes the error of a field as soon as the user types in it.
 * @param {string[]} inputIds - The ids of the input fields.
 */
function clearErrorsOnInput(inputIds) {
    inputIds.forEach(id => {
        document.getElementById(id).addEventListener('input', () => clearFieldError(id));
    });
}


const ICON_LOCK = 'assets/icons/loginPassword.svg';
const ICON_PASSWORD_HIDDEN = 'assets/icons/visibilityOff.svg';
const ICON_PASSWORD_VISIBLE = 'assets/icons/visibility.svg';


/**
 * Sets up the eye button of a password field.
 * The button needs the id of the input + "Toggle".
 * @param {string} inputId - The id of the password field.
 */
function initPasswordToggle(inputId) {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(inputId + 'Toggle');
    input.addEventListener('input', () => updatePasswordToggle(input, toggle));
    toggle.addEventListener('click', () => togglePasswordVisibility(input, toggle));
}


/**
 * Shows or hides the password.
 * @param {HTMLInputElement} input - The password field.
 * @param {HTMLButtonElement} toggle - The eye button.
 */
function togglePasswordVisibility(input, toggle) {
    input.type = input.type === 'password' ? 'text' : 'password';
    updatePasswordToggle(input, toggle);
    input.focus();
}


/**
 * Updates the icon and the label of the eye button.
 * If the field is empty, the lock icon is shown and the button is disabled.
 * @param {HTMLInputElement} input - The password field.
 * @param {HTMLButtonElement} toggle - The eye button.
 */
function updatePasswordToggle(input, toggle) {
    const isEmpty = input.value === '';
    if (isEmpty) input.type = 'password';
    toggle.disabled = isEmpty;
    toggle.querySelector('img').src = getPasswordIcon(input.type, isEmpty);
    const isHidden = input.type === 'password';
    toggle.setAttribute('aria-label', isHidden ? 'Show password' : 'Hide password');
}


/**
 * Chooses the right icon for the password field.
 * @param {string} inputType - The type of the input, "password" or "text".
 * @param {boolean} isEmpty - True if the field is empty.
 * @returns {string} The path of the icon.
 */
function getPasswordIcon(inputType, isEmpty) {
    if (isEmpty) return ICON_LOCK;
    return inputType === 'password' ? ICON_PASSWORD_HIDDEN : ICON_PASSWORD_VISIBLE;
}


/**
 * Sets the eye button back to the start state, e.g. after a form reset.
 * @param {string} inputId - The id of the password field.
 */
function resetPasswordToggle(inputId) {
    const input = document.getElementById(inputId);
    updatePasswordToggle(input, document.getElementById(inputId + 'Toggle'));
}


/**
 * Shows a toast message for a short time.
 * @param {string} toastId - The id of the toast element.
 * @param {number} duration - How long the toast is visible, in milliseconds.
 */
function showToast(toastId, duration) {
    const toast = document.getElementById(toastId);
    toast.classList.add('toast-visible');
    setTimeout(() => toast.classList.remove('toast-visible'), duration);
}
