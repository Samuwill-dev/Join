const SUMMARY_PAGE = 'html/summary.html';
const LOGIN_FIELDS = ['loginEmail', 'loginPassword'];
const SIGNUP_FIELDS = ['signupName', 'signupEmail', 'signupPassword', 'signupConfirm'];
const TOAST_DURATION = 1500;
const INTRO_WAIT_TIME = 300;
const INTRO_MOVE_TIME = 800; // same as the transition in login.css
const BIG_LOGO_WIDTH = 274;


function showSignup() {
    document.getElementById('loginMain').classList.add('d-none');
    document.getElementById('signupWrap').classList.add('d-none');
    document.getElementById('signupMain').classList.remove('d-none');
}


function showLogin() {
    document.getElementById('signupMain').classList.add('d-none');
    document.getElementById('loginMain').classList.remove('d-none');
    document.getElementById('signupWrap').classList.remove('d-none');
}


function initLoginSwitch() {
    document.getElementById('showSignupBtn').addEventListener('click', showSignup);
    document.getElementById('backToLoginBtn').addEventListener('click', showLogin);
}


function initLoginForm() {
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('guestLoginBtn').addEventListener('click', loginAsGuest);
    clearErrorsOnInput(LOGIN_FIELDS);
    initPasswordToggle('loginPassword');
}


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


function getLoginValues() {
    return {
        email: document.getElementById('loginEmail').value.trim(),
        password: document.getElementById('loginPassword').value
    };
}


function validateLogin(values) {
    const emailError = getEmailError(values.email);
    const passwordError = values.password ? '' : 'Please enter your password.';
    if (emailError) showFieldError('loginEmail', emailError);
    if (passwordError) showFieldError('loginPassword', passwordError);
    return !emailError && !passwordError;
}


function getNameError(name) {
    if (!name) return 'Please enter your name.';
    if (!isValidFullName(name)) return 'Please enter your first and last name.';
    return '';
}


function getEmailError(email) {
    if (!email) return 'Please enter your email.';
    if (!isValidEmail(email)) return 'Please enter a valid email address.';
    return '';
}


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


function showLoginFailed(message) {
    showFieldError('loginEmail', '');
    showFieldError('loginPassword', message);
}


function loginAsGuest() {
    setLoginLoading(true);
    loginAndRedirect(createGuestUser());
}


function loginAndRedirect(user) {
    setSession(user);
    window.location.href = SUMMARY_PAGE;
}


function setLoginLoading(isLoading) {
    document.getElementById('loginBtn').disabled = isLoading;
    document.getElementById('guestLoginBtn').disabled = isLoading;
}


function initSignupForm() {
    const form = document.getElementById('signupForm');
    form.addEventListener('submit', handleSignup);
    form.addEventListener('input', updateSignupButton);
    clearErrorsOnInput(SIGNUP_FIELDS);
    initPasswordToggle('signupPassword');
    initPasswordToggle('signupConfirm');
}


function updateSignupButton() {
    const isFilled = SIGNUP_FIELDS.every(id => document.getElementById(id).value.trim() !== '');
    const isAccepted = document.getElementById('privacyCheck').checked;
    document.getElementById('signupBtn').disabled = !(isFilled && isAccepted);
}


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


function getSignupValues() {
    return {
        name: cleanUpName(document.getElementById('signupName').value),
        email: document.getElementById('signupEmail').value.trim(),
        password: document.getElementById('signupPassword').value,
        confirm: document.getElementById('signupConfirm').value
    };
}


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


function finishSignup(email) {
    showToast('signupToast', TOAST_DURATION);
    setTimeout(() => {
        resetSignupForm();
        document.getElementById('loginEmail').value = email;
        showLogin();
    }, TOAST_DURATION);
}


function resetSignupForm() {
    document.getElementById('signupForm').reset();
    resetPasswordToggle('signupPassword');
    resetPasswordToggle('signupConfirm');
    updateSignupButton();
}


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


function moveLogoToHeader(logo, overlay) {
    logo.classList.add('logo-moving');
    logo.style.transform = '';
    overlay.classList.add('intro-overlay-hidden');
    setTimeout(() => removeIntro(logo, overlay), INTRO_MOVE_TIME);
}


function removeIntro(logo, overlay) {
    document.body.classList.remove('intro');
    logo.classList.remove('logo-moving');
    overlay.remove();
}


playIntro();
initLoginSwitch();
initLoginForm();
initSignupForm();
