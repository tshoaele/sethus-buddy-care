const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function game() {
  const elements = new Map();
  function element() {
    const classes = new Set();
    return {
      textContent: '', style: { setProperty() {} }, children: [], listeners: {},
      classList: {
        add: (...names) => names.forEach(name => classes.add(name)),
        remove: (...names) => names.forEach(name => classes.delete(name)),
        toggle(name, on) { if (on) classes.add(name); else classes.delete(name); },
      },
      addEventListener(name, fn) { this.listeners[name] = fn; },
      setAttribute() {}, append(child) { this.children.push(child); },
      replaceChildren(...children) { this.children = children; },
    };
  }
  const data = new Map();
  const context = {
    console, Date, Number, String, Math, Array,
    localStorage: { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) },
    document: {
      querySelector(selector) { if (!elements.has(selector)) elements.set(selector, element()); return elements.get(selector); },
      querySelectorAll() { return []; }, createElement: element,
      documentElement: element(), body: element(), addEventListener() {},
    },
    window: { setTimeout() {} }, setTimeout() {}, setInterval() { return 1; }, clearInterval() {},
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync('app.js', 'utf8') + '\nthis.game = { state, currentTask, celebrate, nextTask, switchMode, wrongAnswer, noSpeechDetected, isMatch };', context);
  return { ...context.game, elements };
}

test('success feedback persists and repeated completions award only one star', () => {
  const g = game();
  g.celebrate(g.currentTask(), 'food');
  g.celebrate(g.currentTask(), 'food');
  assert.equal(g.state.stars, 1);
  assert.equal(g.elements.get('#buddyBubble').textContent, "Thank you! Let's eat an apple.");
  assert.equal(g.elements.get('#nextButton').hidden, false);
  g.nextTask();
  assert.equal(g.currentTask().phrase, 'I want drink');
  assert.equal(g.state.completed, false);
});

test('blue shoes change footwear only after completing the request', () => {
  const g = game();
  g.switchMode('dress');
  g.nextTask();
  assert.equal(g.state.blueShoes, false);
  g.celebrate(g.currentTask(), 'blue shoes');
  assert.equal(g.state.blueShoes, true);
  assert.equal(g.state.dressColor, 'red');
});

test('retry feedback survives UI refresh without resetting earned progress', () => {
  const g = game();
  g.celebrate(g.currentTask(), 'food');
  g.nextTask();
  g.wrongAnswer('hello');
  assert.equal(g.state.stars, 1);
  assert.equal(g.state.todayCount, 1);
  assert.equal(g.elements.get('#buddyBubble').textContent, 'Try with me. You can go slowly.');
  g.noSpeechDetected();
  assert.equal(g.elements.get('#buddyBubble').textContent, 'Tap the mic and speak.');
});

test('switching mode clears completion and starts its first request', () => {
  const g = game();
  g.celebrate(g.currentTask(), 'food');
  g.switchMode('animals');
  assert.equal(g.currentTask().phrase, 'Hello dog');
  assert.equal(g.state.completed, false);
  assert.equal(g.elements.get('#sceneResponse').children.length, 0);
});

test('gentle matching accepts a meaningful single word without substring matches', () => {
  const g = game();
  assert.equal(g.isMatch('food', g.currentTask()), true);
  assert.equal(g.isMatch('want', g.currentTask()), false);
  assert.equal(g.isMatch('seafood', g.currentTask()), false);
});
