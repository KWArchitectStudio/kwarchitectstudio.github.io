/* ==========================================================================
   sequence-player.js - Turns a set of sequential photos into a lightweight,
   video-like animation. No video file, no external library.
   Loaded with `defer` on project-acoustic-sliding-door.html only.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  var player = document.querySelector('[data-sequence-player]');
  if (!player) {
    return;
  }

  var frameImg = player.querySelector('[data-sequence-frame]');
  var toggleBtn = player.querySelector('[data-sequence-toggle]');
  var toggleIcon = toggleBtn.querySelector('.project-sequence-play-icon');
  var scrubber = player.querySelector('[data-sequence-scrubber]');
  var fill = player.querySelector('[data-sequence-fill]');

  var PLAY_GLYPH = '\u25B6';
  var PAUSE_GLYPH = '\u23F8';

  var frameCount = 5;
  var framePrefix = 'images/acoustic-door-sequence-';
  var frameSuffix = '.jpg';
  var frameDurationMs = 220;

  var currentFrame = 1;
  var isPlaying = false;
  var timerId = null;

  function frameSrc(index) {
    var padded = index < 10 ? '0' + index : String(index);
    return framePrefix + padded + frameSuffix;
  }

  function renderFrame(index) {
    currentFrame = index;
    frameImg.src = frameSrc(index);
    var percent = ((index - 1) / (frameCount - 1)) * 100;
    fill.style.width = percent + '%';
    scrubber.setAttribute('aria-valuenow', String(index));
  }

  function stepForward() {
    var next = currentFrame + 1;
    if (next > frameCount) {
      next = 1;
    }
    renderFrame(next);
  }

  function play() {
    if (isPlaying) {
      return;
    }
    isPlaying = true;
    toggleBtn.setAttribute('aria-label', 'Pause sliding door sequence');
    toggleBtn.classList.add('is-playing');
    toggleIcon.textContent = PAUSE_GLYPH;
    timerId = window.setInterval(stepForward, frameDurationMs);
  }

  function pause() {
    isPlaying = false;
    toggleBtn.setAttribute('aria-label', 'Play sliding door sequence');
    toggleBtn.classList.remove('is-playing');
    toggleIcon.textContent = PLAY_GLYPH;
    if (timerId) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }

  function togglePlay() {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }

  toggleBtn.addEventListener('click', togglePlay);

  /* Scrubber: click or drag to jump to a specific frame */
  function setFrameFromPointer(clientX) {
    var rect = scrubber.getBoundingClientRect();
    var ratio = (clientX - rect.left) / rect.width;
    ratio = Math.max(0, Math.min(1, ratio));
    var index = Math.round(ratio * (frameCount - 1)) + 1;
    pause();
    renderFrame(index);
  }

  scrubber.addEventListener('pointerdown', function (event) {
    setFrameFromPointer(event.clientX);
    var onMove = function (moveEvent) {
      setFrameFromPointer(moveEvent.clientX);
    };
    var onUp = function () {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  });

  scrubber.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowRight') {
      pause();
      renderFrame(currentFrame < frameCount ? currentFrame + 1 : 1);
      event.preventDefault();
    } else if (event.key === 'ArrowLeft') {
      pause();
      renderFrame(currentFrame > 1 ? currentFrame - 1 : frameCount);
      event.preventDefault();
    }
  });

  renderFrame(1);
});