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