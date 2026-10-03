/* ==========================================================================
   scroll-reveal.js — Gentle fade/rise-in effect for below-the-fold content
   Loaded with `defer` on all pages. Uses IntersectionObserver to add
   `.is-visible` to `.scroll-reveal` elements as they enter the viewport.
   Falls back to doing nothing (content stays fully visible, since
   `.scroll-reveal` only hides via CSS transform/opacity that degrades
   gracefully) if IntersectionObserver is unsupported.
   ========================================================================== */

/* --------------------------------------------------------------------------
   Pure utility function
   Exported via module.exports for Jest unit tests; also assigned to
   `window` so it is accessible in plain-browser contexts.
   -------------------------------------------------------------------------- */

/**
 * Returns the list of elements within `root` that should receive the
 * scroll-reveal treatment. Pure function — no side effects, fully testable.
 *
 * @param {ParentNode} root - Element or Document to search within.
 * @returns {Element[]} Array of elements matching .scroll-reveal.
 */
function getRevealTargets(root) {
  if (!root || typeof root.querySelectorAll !== 'function') {
    return [];
  }
  return Array.prototype.slice.call(root.querySelectorAll('.scroll-reveal'));
}

/* --------------------------------------------------------------------------
   DOM initialisation — runs after the document is parsed (defer)
   -------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', function () {

  var targets = getRevealTargets(document);
  if (targets.length === 0) {
    return;
  }

  // Respect reduced-motion: skip the observer entirely so elements simply
  // stay at their CSS-defined visible state (handled in styles.css).
  var prefersReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return;
  }

  // Graceful degradation: if IntersectionObserver isn't supported, reveal
  // everything immediately rather than leaving content hidden.
  if (typeof IntersectionObserver !== 'function') {
    targets.forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  // Anything already in (or close to) the viewport on page load should
  // just be visible immediately — animating it in reads as an unwanted
  // flash on first paint / page navigation. Only genuinely below-the-fold
  // content gets the fade-in treatment as the visitor scrolls to it.
  var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  var toObserve = [];

  targets.forEach(function (el) {
    var rect = el.getBoundingClientRect();
    if (rect.top < viewportHeight) {
      el.classList.add('is-visible');
      el.classList.add('no-transition');
    } else {
      toObserve.push(el);
    }
  });

  if (toObserve.length === 0) {
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.15
  });

  toObserve.forEach(function (el) {
    observer.observe(el);
  });

});

/* --------------------------------------------------------------------------
   CommonJS export — allows Jest (Node/jsdom) to import this function
   directly without a bundler. In the browser this block is skipped because
   `module` is not defined.
   -------------------------------------------------------------------------- */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getRevealTargets: getRevealTargets };
}