const SUMMARY_PAGE = 'html/summary.html';
const LOGIN_FIELDS = ['loginEmail', 'loginPassword'];
const SIGNUP_FIELDS = ['signupName', 'signupEmail', 'signupPassword', 'signupConfirm'];
const TOAST_DURATION = 1500;
const INTRO_WAIT_TIME = 300;
const INTRO_MOVE_TIME = 800; // same as the transition in login.css
const BIG_LOGO_WIDTH = 274;


/**
 * Hides the login form and shows the sign up form.
 */
function showSignup() {
    document.getElementById('loginMain').classList.add('d-none');
    document.getElementById('signupWrap').classList.add('d-none');
    document.getElementById('signupMain').classList.remove('d-none');
}


/**
 * Hides the sign up form and shows the login form.
 */
function showLogin() {
    document.getElementById('signupMain').classList.add('d-none');
    document.getElementById('loginMain').classList.remove('d-none');
    document.getElementById('signupWrap').classList.remove('d-none');
}


/**
 * Adds the events to switch between login and sign up.
 */
function initLoginSwitch() {
    document.getElementById('showSignupBtn').addEventListener('click', showSignup);
    document.getElementById('backToLoginBtn').addEventListener('click', showLogin);
}


/**
 * Sets up the login form: submit, guest login, errors and password toggle.
 */
function initLoginForm() {
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('guestLoginBtn').addEventListener('click', loginAsGuest);
    clearErrorsOnInput(LOGIN_FIELDS);
    initPasswordToggle('loginPassword');
}


/**
 * Runs when the login form is sent. Checks the inputs and logs the user in.
 * @param {SubmitEvent} event - The submit event of the form.
 */
async function handleLogin(event) {
    event.preventDefault();
    LOGIN_FIELDS.forEach(clearFieldError);
    const values = getLoginValues();
    if (!validateLogin(values)) return;
    setLoginLoading(true);
    const user = await checkCredentials(values);
    if (user) return loginAndRedirect(user);
    setLoginLoading(false);
}


/**
 * Reads the values of the login form.
 * @returns {{email: string, password: string}} The email and the password.
 */
function getLoginValues() {
    return {
        email: document.getElementById('loginEmail').value.trim(),
        password: document.getElementById('loginPassword').value
    };
}


/**
 * Checks the login inputs and shows errors below the fields.
 * @param {{email: string, password: string}} values - The values of the login form.
 * @returns {boolean} True if all inputs are valid.
 */
function validateLogin(values) {
    const emailError = getEmailError(values.email);
    const passwordError = values.password ? '' : 'Please enter your password.';
    if (emailError) showFieldError('loginEmail', emailError);
    if (passwordError) showFieldError('loginPassword', passwordError);
    return !emailError && !passwordError;
}


/**
 * Returns the error message for the name, or an empty text if it is valid.
 * @param {string} name - The name from the form.
 * @returns {string} The error message or "".
 */
function getNameError(name) {
    if (!name) return 'Please enter your name.';
    if (!isValidFullName(name)) return 'Please enter your first and last name.';
    return '';
}


/**
 * Returns the error message for the email, or an empty text if it is valid.
 * @param {string} email - The email from the form.
 * @returns {string} The error message or "".
 */
function getEmailError(email) {
    if (!email) return 'Please enter your email.';
    if (!isValidEmail(email)) return 'Please enter a valid email address.';
    return '';
}


/**
 * Checks email and password against the users in Firebase.
 * Shows an error if the login is not possible.
 * @param {{email: string, password: string}} values - The values of the login form.
 * @returns {Promise<User|null>} The user, or null if the login failed.
 */
async function checkCredentials(values) {
    try {
        const user = await findUserByEmail(values.email);
        if (user && user.password === values.password) return user;
        showLoginFailed('Check your email and password. Please try again.');
    } catch (error) {
        showLoginFailed('Login failed. Please try again later.');
    }
    return null;
}


/**
 * Marks both fields red and shows the message below the password.
 * @param {string} message - The error message.
 */
function showLoginFailed(message) {
    showFieldError('loginEmail', '');
    showFieldError('loginPassword', message);
}


/**
 * Logs in as guest without email and password.
 */
function loginAsGuest() {
    setLoginLoading(true);
    loginAndRedirect(createGuestUser());
}


/**
 * Saves the user in the session and opens the summary page.
 * @param {User} user - The user who logged in.
 */
function loginAndRedirect(user) {
    setSession(user);
    window.location.href = SUMMARY_PAGE;
}


/**
 * Disables the login buttons while the login is running, so nobody clicks twice.
 * @param {boolean} isLoading - True while the login is running.
 */
function setLoginLoading(isLoading) {
    document.getElementById('loginBtn').disabled = isLoading;
    document.getElementById('guestLoginBtn').disabled = isLoading;
}


/**
 * Sets up the sign up form: submit, button state, errors and password toggles.
 */
function initSignupForm() {
    const form = document.getElementById('signupForm');
    form.addEventListener('submit', handleSignup);
    form.addEventListener('input', updateSignupButton);
    clearErrorsOnInput(SIGNUP_FIELDS);
    initPasswordToggle('signupPassword');
    initPasswordToggle('signupConfirm');
}


/**
 * Enables the sign up button only if all fields are filled
 * and the privacy policy is accepted.
 */
function updateSignupButton() {
    const isFilled = SIGNUP_FIELDS.every(id => document.getElementById(id).value.trim() !== '');
    const isAccepted = document.getElementById('privacyCheck').checked;
    document.getElementById('signupBtn').disabled = !(isFilled && isAccepted);
}


/**
 * Runs when the sign up form is sent. Checks the inputs and creates the account.
 * @param {SubmitEvent} event - The submit event of the form.
 */
async function handleSignup(event) {
    event.preventDefault();
    SIGNUP_FIELDS.forEach(clearFieldError);
    const values = getSignupValues();
    if (!validateSignup(values)) return;
    document.getElementById('signupBtn').disabled = true;
    const isCreated = await createAccount(values);
    if (isCreated) return finishSignup(values.email);
    updateSignupButton();
}


/**
 * Reads the values of the sign up form.
 * @returns {{name: string, email: string, password: string, confirm: string}} The form values.
 */
function getSignupValues() {
    return {
        name: cleanUpName(document.getElementById('signupName').value),
        email: document.getElementById('signupEmail').value.trim(),
        password: document.getElementById('signupPassword').value,
        confirm: document.getElementById('signupConfirm').value
    };
}


/**
 * Checks the sign up inputs and shows errors below the fields.
 * @param {{name: string, email: string, password: string, confirm: string}} values - The form values.
 * @returns {boolean} True if all inputs are valid.
 */
function validateSignup(values) {
    const errors = {
        signupName: getNameError(values.name),
        signupEmail: getEmailError(values.email),
        signupPassword: values.password ? '' : 'Please enter a password.',
        signupConfirm: values.password === values.confirm ? '' : "Your passwords don't match. Please try again."
    };
    Object.entries(errors).forEach(([id, message]) => { if (message) showFieldError(id, message); });
    return Object.values(errors).every(message => message === '');
}


/**
 * Saves the new user in Firebase, if the email is not used yet.
 * @param {{name: string, email: string, password: string}} values - The form values.
 * @returns {Promise<boolean>} True if the account was created.
 */
async function createAccount(values) {
    try {
        if (await findUserByEmail(values.email)) {
            showFieldError('signupEmail', 'This email is already registered.');
            return false;
        }
        await addUser({ name: capitalizeName(values.name), email: values.email, password: values.password, color: getRandomColor() });
        return true;
    } catch (error) {
        showFieldError('signupConfirm', 'Sign up failed. Please try again later.');
        return false;
    }
}


/**
 * Shows the success toast and then goes back to the login
 * with the new email already filled in.
 * @param {string} email - The email of the new user.
 */
function finishSignup(email) {
    showToast('signupToast', TOAST_DURATION);
    setTimeout(() => {
        resetSignupForm();
        document.getElementById('loginEmail').value = email;
        showLogin();
    }, TOAST_DURATION);
}


/**
 * Clears the sign up form and sets the buttons back.
 */
function resetSignupForm() {
    document.getElementById('signupForm').reset();
    resetPasswordToggle('signupPassword');
    resetPasswordToggle('signupConfirm');
    updateSignupButton();
}


/**
 * Starts the intro: the big logo in the middle moves to its place in the header.
 * Without animation if the user has turned off animations in the system.
 */
function playIntro() {
    const logo = document.getElementById('loginLogo');
    const overlay = document.getElementById('introOverlay');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return removeIntro(logo, overlay);
    }
    logo.style.transform = getTransformToCenter(logo);
    document.body.classList.remove('intro');
    setTimeout(() => moveLogoToHeader(logo, overlay), INTRO_WAIT_TIME);
}


/**
 * Calculates the transform that moves the logo from its normal place
 * in the header to the middle of the screen and makes it bigger.
 * The logo stays in the header, it is only moved visually.
 * @param {HTMLElement} logo - The logo image in the header.
 * @returns {string} The transform value, e.g. "translate(570px, 384px) scale(2.74)".
 */
function getTransformToCenter(logo) {
    const logoBox = logo.getBoundingClientRect();
    // distance from the middle of the logo to the middle of the screen
    const distanceX = window.innerWidth / 2 - (logoBox.left + logoBox.width / 2);
    const distanceY = window.innerHeight / 2 - (logoBox.top + logoBox.height / 2);
    // how much bigger the logo is in the middle (274px instead of 100px)
    const scaleFactor = BIG_LOGO_WIDTH / logoBox.width;
    // translate first, otherwise the scale would also make the movement bigger
    return `translate(${distanceX}px, ${distanceY}px) scale(${scaleFactor})`;
}


/**
 * Moves the logo back to the header and fades out the white overlay.
 * @param {HTMLElement} logo - The logo image in the header.
 * @param {HTMLElement} overlay - The white overlay of the intro.
 */
function moveLogoToHeader(logo, overlay) {
    logo.classList.add('logo-moving');
    logo.style.transform = '';
    overlay.classList.add('intro-overlay-hidden');
    setTimeout(() => removeIntro(logo, overlay), INTRO_MOVE_TIME);
}


/**
 * Ends the intro and removes the overlay from the page.
 * @param {HTMLElement} logo - The logo image in the header.
 * @param {HTMLElement} overlay - The white overlay of the intro.
 */
function removeIntro(logo, overlay) {
    document.body.classList.remove('intro');
    logo.classList.remove('logo-moving');
    overlay.remove();
}


playIntro();
initLoginSwitch();
initLoginForm();
initSignupForm();
