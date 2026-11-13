const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FULL_NAME_PATTERN = /^\p{L}[\p{L}'-]*( \p{L}[\p{L}'-]*)+$/u;


function isValidEmail(email) {
    return EMAIL_PATTERN.test(email);
}


function isValidFullName(name) {
    return FULL_NAME_PATTERN.test(name);
}


function cleanUpName(name) {
    return name.trim().replace(/\s+/g, ' ');
}


function capitalizeName(name) {
    return name.replace(/(^|[ -])\p{L}/gu, letter => letter.toUpperCase());
}


function showFieldError(inputId, message) {
    const input = document.getElementById(inputId);
    input.closest('.input-group').classList.add('has-error');
    document.getElementById(inputId + 'Error').textContent = message;
}


function clearFieldError(inputId) {
    const input = document.getElementById(inputId);
    input.closest('.input-group').classList.remove('has-error');
    document.getElementById(inputId + 'Error').textContent = '';
}


function clearErrorsOnInput(inputIds) {
    inputIds.forEach(id => {
        document.getElementById(id).addEventListener('input', () => clearFieldError(id));
    });
}


const ICON_LOCK = 'assets/icons/loginPassword.svg';
const ICON_PASSWORD_HIDDEN = 'assets/icons/visibilityOff.svg';
const ICON_PASSWORD_VISIBLE = 'assets/icons/visibility.svg';


function initPasswordToggle(inputId) {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(inputId + 'Toggle');
    input.addEventListener('input', () => updatePasswordToggle(input, toggle));
    toggle.addEventListener('click', () => togglePasswordVisibility(input, toggle));
}


function togglePasswordVisibility(input, toggle) {
    input.type = input.type === 'password' ? 'text' : 'password';
    updatePasswordToggle(input, toggle);
    input.focus();
}


function updatePasswordToggle(input, toggle) {
    const isEmpty = input.value === '';
    if (isEmpty) input.type = 'password';
    toggle.disabled = isEmpty;
    toggle.querySelector('img').src = getPasswordIcon(input.type, isEmpty);
    const isHidden = input.type === 'password';
    toggle.setAttribute('aria-label', isHidden ? 'Show password' : 'Hide password');
}


function getPasswordIcon(inputType, isEmpty) {
    if (isEmpty) return ICON_LOCK;
    return inputType === 'password' ? ICON_PASSWORD_HIDDEN : ICON_PASSWORD_VISIBLE;
}


function resetPasswordToggle(inputId) {
    const input = document.getElementById(inputId);
    updatePasswordToggle(input, document.getElementById(inputId + 'Toggle'));
}


function showToast(toastId, duration) {
    const toast = document.getElementById(toastId);
    toast.classList.add('toast-visible');
    setTimeout(() => toast.classList.remove('toast-visible'), duration);
}
