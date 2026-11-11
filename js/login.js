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


initLoginSwitch();
