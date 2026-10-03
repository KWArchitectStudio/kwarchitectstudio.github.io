/**
 * Unit tests for scroll-reveal.js
 */
const { getRevealTargets } = require('../js/scroll-reveal.js');

describe('scroll-reveal.js', () => {
  test('getRevealTargets returns an empty array when root is null', () => {
    expect(getRevealTargets(null)).toEqual([]);
  });

  test('getRevealTargets returns an empty array when root has no querySelectorAll', () => {
    expect(getRevealTargets({})).toEqual([]);
  });

  test('getRevealTargets returns all elements matching .scroll-reveal', () => {
    document.body.innerHTML = `
      <div class="scroll-reveal" id="a"></div>
      <div id="b"></div>
      <section class="scroll-reveal" id="c"></section>
    `;
    const targets = getRevealTargets(document);
    expect(targets).toHaveLength(2);
    expect(targets.map((el) => el.id)).toEqual(['a', 'c']);
  });

  test('getRevealTargets returns an empty array when no elements match', () => {
    document.body.innerHTML = '<div id="b"></div>';
    expect(getRevealTargets(document)).toEqual([]);
  });
});