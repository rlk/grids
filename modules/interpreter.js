// Copyright (c) 2025 Robert Kooima

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import { Chord, alignMarks, alignFrets } from './chord.js';
import { toElement, toNode } from './utility.js';

export function interpret(text, debug) {
  var stack = []

  function outerElement(tagName) {
    var element = document.createElement(tagName);
    var child = stack.pop();
    while (child !== '(') {
      element.prepend(toNode(child, 'span'));
      child = stack.pop();
    }
    stack.push(element);
  }

  function innerElement(tagName) {
    const child = stack.pop();
    if (child !== '[') {
      var element = document.createElement(tagName);
      element.append(toNode(child, 'span'));
      innerElement(tagName);
      stack.push(element);
    }
  }

  const words = text.trim().split(/[ \n]+/);
  for (const word of words) {

    // Chord constructor

    if (word === 'chord') {
      const d = stack.pop();
      const k = stack.pop();
      stack.push(new Chord(k, d));

      // Stop constructors

    } else if (
      word === '+' || word === 'x' || word === '=' ||
      word === '^' || word === 'o' || word === '_') {
      const i = stack.pop();
      const f = stack.pop();
      const s = stack.pop();
      const c = stack.pop();
      stack.push(c.add(s, f, i, word, false));

    } else if (
      word === '(+)' || word === '(x)' || word === '(=)' ||
      word === '(^)' || word === '(o)' || word === '(_)') {
      const i = stack.pop();
      const f = stack.pop();
      const s = stack.pop();
      const c = stack.pop();
      stack.push(c.add(s, f, i, word.at(1), true));

    } else if (word === '.') {
      const l = stack.pop();
      const i = stack.pop();
      const f = stack.pop();
      const s = stack.pop();
      const c = stack.pop();
      stack.push(c.add(s, f, i, l));

    } else if (word === "'") {
      const j = stack.pop();
      const c = stack.pop();
      const b = stack.pop();
      stack.push(b, c.push(b.stops[j]));

    } else if (word === '/') {
      stack.push(stack.pop().rot());

      // Chord options

    } else if (word === '?') {
      const c = stack.pop();
      c.options.setOptional(true);
      stack.push(c);

    } else if (word === '$') {
      const c = stack.pop();
      c.options.setNoSymbol(true);
      stack.push(c);

    } else if (word === '!') {
      const t = stack.pop();
      const c = stack.pop();
      c.options.setText(t);
      stack.push(c);

    } else if (word === '#') {
      const f = stack.pop();
      const s = stack.pop();
      const c = stack.pop();
      c.options.setFinger(s, f);
      stack.push(c);

      // Chord operators

    } else if (word === 's+') {
      stack.push(stack.pop().incString());

    } else if (word === 's-') {
      stack.push(stack.pop().decString());

    } else if (word === 'd+') {
      stack.push(stack.pop().incDegree());

    } else if (word === 'd-') {
      stack.push(stack.pop().decDegree());

    } else if (word === '4+') {
      stack.push(stack.pop().incDegree().incDegree().incDegree().decString());

    } else if (word === '5-') {
      stack.push(stack.pop().decDegree().decDegree().decDegree().decDegree().incString());

    } else if (word === 'i+') {
      stack.push(stack.pop().incInversion());

    } else if (word === 'i-') {
      stack.push(stack.pop().decInversion());

    } else if (word === 'o+') {
      stack.push(stack.pop().incOctave());

    } else if (word === 'o-') {
      stack.push(stack.pop().decOctave());

      // Bar constructors

    } else if (word === '|:') {
      stack.push(toElement('span', 'bar', '𝄆'));

    } else if (word === '|') {
      stack.push(toElement('span', 'bar', '𝄀'));

    } else if (word === ':|') {
      stack.push(toElement('span', 'bar', '𝄇'));

      // Stack-mapping operators

    } else if (word === 'af') {
      alignFrets(stack.filter(x => x instanceof Chord));

    } else if (word === 'am') {
      alignMarks(stack.filter(x => x instanceof Chord));

      // Stack operators

    } else if (word === 'drop') {
      stack.pop();

    } else if (word === 'swap') {
      const a = stack.pop();
      const b = stack.pop();
      stack.push(a, b);

    } else if (word === 'dupe') {
      const a = stack.pop();
      if (a instanceof Element) {
        stack.push(a, a.cloneNode(true));
      } else if (a instanceof Chord) {
        stack.push(a, a.copy());
      } else {
        stack.push(a, a);
      }

    } else if (word === 'over') {
      const a = stack.pop();
      const b = stack.pop();
      const c = b.copy();
      stack.push(b, a, c);

      // HTML element operators

    } else if (word === ')') {
      outerElement(stack.pop());

    } else if (word === ']') {
      innerElement(stack.pop());

    } else if (word === 'class') {
      var name = stack.pop();
      var element = stack.pop();
      element.setAttribute('class', name);
      stack.push(element);

      // Operands

    } else if (isNaN(word) || word.trim().length == 0) {
      stack.push(word);

    } else {
      stack.push(parseInt(word, 10));
    }

    if (debug) {
      console.log(stack.map(e => e instanceof Element ? e.outerHTML : e).join(' '));
    }
  }
  return stack.length == 1 ? stack[0] : stack;
}
