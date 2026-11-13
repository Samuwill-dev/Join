/**
 * Loads shared page-header templates declared in the document.
 * @returns {Promise<void>}
 */
async function includeHTML() {
  const elements = document.querySelectorAll('[w3-include-html]');
  for (const element of elements) {
    await includeTemplate(element);
  }
}

/**
 * Fetches and applies one HTML template.
 * @param {Element} element Template host element.
 * @returns {Promise<void>}
 */
async function includeTemplate(element) {
  const file = getTemplatePath(element);
  element.innerHTML = await fetchTemplate(file);
  configureTemplate(element, file);
  element.removeAttribute('w3-include-html');
}

/**
 * Returns the path configured on a template host.
 * @param {Element} element Template host element.
 * @returns {string} Template path.
 */
function getTemplatePath(element) {
  const file = element.getAttribute('w3-include-html');
  if (!file) throw new Error('Missing file path for HTML include.');
  return file;
}

/**
 * Fetches a template and reports failed HTTP responses.
 * @param {string} file Template path.
 * @returns {Promise<string>} Template HTML.
 */
async function fetchTemplate(file) {
  const response = await fetch(file);
  if (!response.ok) throw new Error(`Could not load ${file}: ${response.status}`);
  return response.text();
}

/**
 * Applies page-specific settings to an included template.
 * @param {Element} element Template host element.
 * @param {string} file Template path.
 * @returns {void}
 */
function configureTemplate(element, file) {
  const layout = getLayout(element);
  configureNavigation(element, layout, file);
  setActivePage(element);
  setPageHref(element, 'data-privacy-href', 'privacyPolicy');
  setPageHref(element, 'data-legal-notice-href', 'legalNotice');
}

/**
 * Gets and validates the requested template layout.
 * @param {Element} element Template host element.
 * @returns {"internal"|"external"} Template layout.
 */
function getLayout(element) {
  const layout = element.getAttribute('data-layout') || 'internal';
  if (layout !== 'internal' && layout !== 'external') {
    throw new Error(`Unknown template layout: ${layout}`);
  }
  return layout;
}

/**
 * Displays the navigation and profile controls for the selected layout.
 * @param {Element} element Template host element.
 * @param {"internal"|"external"} layout Template layout.
 * @param {string} file Template path.
 * @returns {void}
 */
function configureNavigation(element, layout, file) {
  const controls = getNavigationElements(element, file);
  if (layout === 'external') return configureExternalLayout(controls);
  controls.external.remove();
  renderUserInitials(controls.profile);
}

/**
 * Finds the navigation controls required by the template.
 * @param {Element} element Template host element.
 * @param {string} file Template path.
 * @returns {{internal: Element, external: Element, profile: Element}} Navigation controls.
 */
function getNavigationElements(element, file) {
  const internal = element.querySelector('[data-internal-navigation]');
  const external = element.querySelector('[data-external-navigation]');
  const profile = element.querySelector('[data-profile-button]');
  if (!internal || !external || !profile) throw new Error(`The template ${file} is missing required layout elements.`);
  return { internal, external, profile };
}

/**
 * Applies the external layout without internal navigation or profile control.
 * @param {{internal: Element, external: Element, profile: Element}} controls Navigation controls.
 * @returns {void}
 */
function configureExternalLayout(controls) {
  controls.internal.remove();
  controls.external.removeAttribute('hidden');
  controls.profile.remove();
}

/**
 * Marks the configured page link as current.
 * @param {Element} element Template host element.
 * @returns {void}
 */
function setActivePage(element) {
  const activePage = element.getAttribute('data-active-page');
  if (!activePage) return;
  for (const link of element.querySelectorAll('[data-page]')) {
    setActiveLink(link, activePage);
  }
}

/**
 * Updates one navigation link's active state.
 * @param {Element} link Navigation link.
 * @param {string} activePage Active page identifier.
 * @returns {void}
 */
function setActiveLink(link, activePage) {
  const isActive = link.getAttribute('data-page') === activePage;
  link.classList.toggle('active', isActive);
  if (isActive) link.setAttribute('aria-current', 'page');
  else link.removeAttribute('aria-current');
}

/**
 * Overrides a page link when a variant-specific target is set.
 * @param {Element} element Template host element.
 * @param {string} hrefAttribute Name of the host attribute with the target URL.
 * @param {string} page Page identifier for the target link.
 * @returns {void}
 */
function setPageHref(element, hrefAttribute, page) {
  const href = element.getAttribute(hrefAttribute);
  const link = element.querySelector(`[data-page="${page}"]`);
  if (href && link) link.setAttribute('href', href);
}
