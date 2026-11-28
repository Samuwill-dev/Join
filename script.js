/**
 * Takes you back to the previous page. Without a previous page of Join it opens the fallback page.
 * @param {string} [fallbackPage] - The page without a previous page, summary.html if not given.
 */
function goBack(fallbackPage) {
  if (document.referrer && document.referrer.includes(window.location.host)) {
    history.back();
  } else if (fallbackPage) {
    window.location.href = fallbackPage;
  } else {
    window.location.href = 'summary.html';
  }
}

function gotoBoard() {
    window.location.href = '../html/board.html';
}

function clearForm() {
    const form = document.querySelector('form');
    if (!form) return;
    form.reset();
    if (form.contains(document.activeElement)) {
        document.activeElement.blur();
    }
    document.querySelectorAll('.error-msg').forEach(msg => msg.textContent = '');
}