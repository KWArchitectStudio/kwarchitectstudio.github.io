/* ==========================================================================
   nav.js — Mobile menu toggle + footer year
   Loaded with `defer` on all five pages.
   ========================================================================== */

/* --------------------------------------------------------------------------
   Pure utility functions
   Exported via module.exports for Jest unit/property tests; also assigned to
   `window` so they are accessible in plain-browser contexts.
   -------------------------------------------------------------------------- */

/**
 * Returns the 4-digit year from a Date-like object.
 * Pure function — no side effects, fully testable.
 *
 * @param {Date} date - Any object with a getFullYear() method.
 * @returns {number} The 4-digit year.
 */
function getFooterYear(date) {
  return date.getFullYear();
}

/**
 * Sets aria-current="page" on the link whose href matches currentPage,
 * and removes it from all other links.
 * Pure function — operates only on the provided elements.
 *
 * @param {HTMLAnchorElement[]} links - Array of <a> elements (nav links).
 * @param {string} currentPage - Filename to match, e.g. 'index.html'.
 */
function setActiveNav(links, currentPage) {
  links.forEach(function (link) {
    // Match on the last segment of the href so relative paths work
    var href = link.getAttribute('href') || '';
    // Normalise: strip leading path segments, keep filename
    var filename = href.split('/').pop();

    if (filename === currentPage) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

/* --------------------------------------------------------------------------
   DOM initialisation — runs after the document is parsed (defer)
   -------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', function () {

  /* --- Footer year -------------------------------------------------------- */
  var yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = getFooterYear(new Date());
  }

  /* --- Mobile menu toggle ------------------------------------------------- */
  var toggleBtn = document.querySelector('.nav-toggle');
  var navLinks  = document.querySelector('.nav-links');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

});

/* --------------------------------------------------------------------------
   CommonJS export — allows Jest (Node/jsdom) to import these functions
   directly without a bundler. In the browser this block is skipped because
   `module` is not defined.
   -------------------------------------------------------------------------- */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getFooterYear: getFooterYear, setActiveNav: setActiveNav };
}
