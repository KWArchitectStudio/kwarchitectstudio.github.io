/* ==========================================================================
   page-transition.js — Fade transition between pages
   Loaded with `defer` on all pages. Fades the page in on load, and fades
   the page out before following internal link clicks so navigation feels
   like a smooth cross-fade rather than an abrupt white flash.
   ========================================================================== */

/* --------------------------------------------------------------------------
   Pure utility function
   Exported via module.exports for Jest unit tests; also assigned to
   `window` so it is accessible in plain-browser contexts.
   -------------------------------------------------------------------------- */

/**
 * Decides whether a link click should be intercepted for a fade-out
 * transition before navigating. Pure function — no side effects.
 *
 * Returns false for: external links, new-tab/download/modified clicks,
 * same-page hash anchors, and links with no href.
 *
 * @param {HTMLAnchorElement} link - The anchor element that was clicked.
 * @param {MouseEvent} event - The click event (checked for modifier keys).
 * @param {Location} location - window.location (or an equivalent object).
 * @returns {boolean} True if the navigation should be intercepted.
 */
function shouldInterceptLink(link, event, location) {
  if (!link || !link.getAttribute) {
    return false;
  }

  var href = link.getAttribute('href');
  if (!href || href.charAt(0) === '#') {
    return false;
  }

  // Let the browser handle new tab / download / modified clicks normally
  if (event) {
    if (event.defaultPrevented || event.button === 1 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return false;
    }
  }

  if (link.target && link.target !== '' && link.target !== '_self') {
    return false;
  }

  if (link.hasAttribute('download')) {
    return false;
  }

  // Only intercept same-origin links (external links navigate normally)
  if (link.origin && location && link.origin !== location.origin) {
    return false;
  }

  return true;
}

/* --------------------------------------------------------------------------
   DOM initialisation — runs after the document is parsed (defer)
   -------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', function () {

  // The fade-in on load is handled entirely by a CSS animation on `body`
  // (styles.css), so it works even if this script fails to load. Only the
  // fade-out-before-navigating behaviour needs JS.

  var prefersReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return;
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest ? event.target.closest('a') : null;
    if (!shouldInterceptLink(link, event, window.location)) {
      return;
    }

    event.preventDefault();
    document.body.classList.add('page-fade-out');

    // Matches the 0.4s opacity transition on .page-fade-out in styles.css
    window.setTimeout(function () {
      window.location.href = link.href;
    }, 400);
  });

});

/* --------------------------------------------------------------------------
   CommonJS export — allows Jest (Node/jsdom) to import this function
   directly without a bundler. In the browser this block is skipped because
   `module` is not defined.
   -------------------------------------------------------------------------- */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { shouldInterceptLink: shouldInterceptLink };
}