/* ==========================================================================
   contact.js — Contact form validation and Formspree submission
   Loaded with `defer` on contact.html only.
   ========================================================================== */

/**
 * Validates required contact form fields.
 * Pure function — no DOM side effects; fully testable.
 *
 * @param {{ name: string, email: string, message: string }} fields
 * @returns {Object} errors — keyed by field name; empty object if all valid
 */
function validateForm(fields) {
  var errors = {};

  // Name: required, non-whitespace
  if (!fields.name || /^\s*$/.test(fields.name)) {
    errors.name = 'Please enter your name.';
  }

  // Email: required, must match basic email pattern (local-part@domain.tld)
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!fields.email || /^\s*$/.test(fields.email)) {
    errors.email = 'Please enter your email address.';
  } else if (!emailPattern.test(fields.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  // Message: required, non-whitespace
  if (!fields.message || /^\s*$/.test(fields.message)) {
    errors.message = 'Please enter a message.';
  }

  return errors;
}

/**
 * Returns the 4-digit year from a Date-like object.
 * Pure function — supports Property 4 testability.
 *
 * @param {Date} date
 * @returns {number}
 */
function getFooterYear(date) {
  return date.getFullYear();
}

/* --------------------------------------------------------------------------
   Form submission handler
   -------------------------------------------------------------------------- */

/**
 * Handles the contact form submit event.
 * Exported for unit testing.
 *
 * @param {Event} event - The form submit event.
 */
function handleSubmit(event) {
  event.preventDefault();

  var form = event.target;
  var honeypot = document.getElementById('address');
  var successBanner = form.querySelector('.form-success');
  var errorBanner   = form.querySelector('.form-error');
  var submitBtn     = form.querySelector('[type="submit"]');

  // --- Property 3: honeypot check — silently abort if filled ---
  if (honeypot && honeypot.value) {
    return;
  }

  // --- Gather field values ---
  var nameEl    = document.getElementById('name');
  var emailEl   = document.getElementById('email');
  var messageEl = document.getElementById('message');

  var fields = {
    name:    nameEl    ? nameEl.value    : '',
    email:   emailEl   ? emailEl.value   : '',
    message: messageEl ? messageEl.value : ''
  };

  // --- Clear previous error states ---
  ['name', 'email', 'message'].forEach(function (key) {
    var fieldEl = document.getElementById(key);
    var errorEl = document.getElementById(key + '-error');
    if (fieldEl) {
      fieldEl.removeAttribute('aria-invalid');
      fieldEl.removeAttribute('aria-describedby');
    }
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }
  });

  // Hide banners
  if (successBanner) successBanner.hidden = true;
  if (errorBanner)   errorBanner.hidden   = true;

  // --- Property 1: validate ---
  var errors = validateForm(fields);
  var errorKeys = Object.keys(errors);

  if (errorKeys.length > 0) {
    var firstInvalidEl = null;

    errorKeys.forEach(function (key) {
      var fieldEl = document.getElementById(key);
      var errorEl = document.getElementById(key + '-error');

      if (fieldEl) {
        fieldEl.setAttribute('aria-invalid', 'true');
        fieldEl.setAttribute('aria-describedby', key + '-error');
        if (!firstInvalidEl) firstInvalidEl = fieldEl;
      }
      if (errorEl) {
        errorEl.textContent = errors[key];
        errorEl.style.display = 'block';
      }
    });

    if (firstInvalidEl) firstInvalidEl.focus();
    return;
  }

  // --- Submitting state ---
  if (submitBtn) submitBtn.disabled = true;

  // --- Property 2: fetch submission ---
  fetch(form.action, {
    method: 'POST',
    body: new FormData(form),
    headers: { 'Accept': 'application/json' }
  })
  .then(function (response) {
    if (response.ok) {
      // Success — hide form, show success message
      form.style.display = 'none';
      if (successBanner) successBanner.hidden = false;
    } else {
      // Error — show error banner, re-enable submit, preserve values
      if (errorBanner) errorBanner.hidden = false;
      if (submitBtn) submitBtn.disabled = false;
    }
  })
  .catch(function () {
    // Network failure — same as error
    if (errorBanner) errorBanner.hidden = false;
    if (submitBtn) submitBtn.disabled = false;
  });
}

/* --------------------------------------------------------------------------
   DOM initialisation
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', handleSubmit);
  }
});

/* --------------------------------------------------------------------------
   CommonJS export for Jest
   -------------------------------------------------------------------------- */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { validateForm: validateForm, getFooterYear: getFooterYear, handleSubmit: handleSubmit };
}
