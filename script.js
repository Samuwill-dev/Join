/**
 * takes you back to the previous page
 */
function goBack() {
  if (document.referrer && document.referrer.includes(window.location.host)) {
    history.back();
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