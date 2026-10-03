/* ==========================================================================
   testimonial-slider.js - Lightweight, dependency-free testimonial carousel
   Loaded with `defer` on index.html only.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  var slider = document.querySelector('[data-testimonial-slider]');
  if (!slider) {
    return;
  }

  var slides = Array.prototype.slice.call(slider.querySelectorAll('.testimonial-slide'));
  var dots = Array.prototype.slice.call(slider.querySelectorAll('.testimonial-dot'));
  var prevBtn = slider.querySelector('.testimonial-arrow-prev');
  var nextBtn = slider.querySelector('.testimonial-arrow-next');

  if (slides.length === 0) {
    return;
  }

  var currentIndex = 0;

  function showSlide(index) {
    if (index < 0) {
      index = slides.length - 1;
    } else if (index >= slides.length) {
      index = 0;
    }

    slides.forEach(function (slide, i) {
      var isActive = i === index;
      slide.hidden = !isActive;
      slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    });

    dots.forEach(function (dot, i) {
      var isActive = i === index;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    currentIndex = index;
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      showSlide(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      showSlide(currentIndex + 1);
    });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      showSlide(i);
    });
  });

  showSlide(0);
});