/**
 * Unit tests for page-transition.js
 */
const { shouldInterceptLink } = require('../js/page-transition.js');

describe('page-transition.js', () => {
  const location = { origin: 'https://www.kwarchistudio.co.nz' };

  function makeLink(href, overrides) {
    const link = document.createElement('a');
    link.setAttribute('href', href);
    Object.assign(link, overrides || {});
    return link;
  }

  test('returns false when link is null', () => {
    expect(shouldInterceptLink(null, {}, location)).toBe(false);
  });

  test('returns false for hash-only anchors', () => {
    const link = makeLink('#section');
    expect(shouldInterceptLink(link, {}, location)).toBe(false);
  });

  test('returns false for links with no href', () => {
    const link = document.createElement('a');
    expect(shouldInterceptLink(link, {}, location)).toBe(false);
  });

  test('returns false when the click event is already handled (defaultPrevented)', () => {
    const link = makeLink('about.html');
    expect(shouldInterceptLink(link, { defaultPrevented: true }, location)).toBe(false);
  });

  test('returns false for modified clicks (ctrl/meta/shift/alt, middle button)', () => {
    const link = makeLink('about.html');
    expect(shouldInterceptLink(link, { ctrlKey: true }, location)).toBe(false);
    expect(shouldInterceptLink(link, { metaKey: true }, location)).toBe(false);
    expect(shouldInterceptLink(link, { shiftKey: true }, location)).toBe(false);
    expect(shouldInterceptLink(link, { altKey: true }, location)).toBe(false);
    expect(shouldInterceptLink(link, { button: 1 }, location)).toBe(false);
  });

  test('returns false for links opening in a new tab (target="_blank")', () => {
    const link = makeLink('https://www.facebook.com/', { target: '_blank' });
    expect(shouldInterceptLink(link, {}, location)).toBe(false);
  });

  test('returns false for download links', () => {
    const link = makeLink('file.pdf');
    link.setAttribute('download', '');
    expect(shouldInterceptLink(link, {}, location)).toBe(false);
  });

  test('returns false for external (different-origin) links', () => {
    const link = makeLink('https://www.linkedin.com/');
    expect(shouldInterceptLink(link, {}, location)).toBe(false);
  });

  test('returns true for a plain internal link click', () => {
    const link = makeLink('about.html');
    expect(shouldInterceptLink(link, {}, location)).toBe(true);
  });

  test('returns true when event is undefined (no modifier keys to check)', () => {
    const link = makeLink('about.html');
    expect(shouldInterceptLink(link, undefined, location)).toBe(true);
  });
});