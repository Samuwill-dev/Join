/**
 * Sets up the mobile view: back button, options button and closing the options menu.
 */
function initContactView() {
    document.getElementById('contactBackBtn').addEventListener('click', hideContactDetails);
    document.getElementById('contactMoreBtn').addEventListener('click', toggleContactMenu);
    document.addEventListener('click', closeContactMenuOnOutsideClick);
}


/**
 * Shows the details of the selected contact. On mobile the list is hidden.
 * The contact logic calls this after it has put the details into #contactDetails.
 */
function showContactDetails() {
    document.getElementById('contactsPage').classList.add('contact-open');
}


/**
 * Hides the details and shows the contact list again on mobile.
 */
function hideContactDetails() {
    closeContactMenu();
    document.getElementById('contactsPage').classList.remove('contact-open');
}


/**
 * Opens or closes the menu with Edit and Delete on mobile.
 */
function toggleContactMenu() {
    const isOpen = document.getElementById('contactsPage').classList.toggle('contact-menu-open');
    document.getElementById('contactMoreBtn').setAttribute('aria-expanded', isOpen);
}


/**
 * Closes the menu with Edit and Delete on mobile.
 */
function closeContactMenu() {
    document.getElementById('contactsPage').classList.remove('contact-menu-open');
    document.getElementById('contactMoreBtn').setAttribute('aria-expanded', false);
}


/**
 * Closes the menu after every click, except a click on the options button itself.
 * So the menu also closes after Edit or Delete.
 * @param {MouseEvent} event - The click event of the page.
 */
function closeContactMenuOnOutsideClick(event) {
    if (document.getElementById('contactMoreBtn').contains(event.target)) return;
    closeContactMenu();
}
