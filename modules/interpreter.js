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

class Interpreter {
  constructor() {
    this.dictionary = {
      '|': ['(', '𝄀', 'span', ')', 'bar', 'class'],
      '|:': ['(', '𝄆', 'span', ')', 'bar', 'class'],
      ':|': ['(', '𝄇', 'span', ')', 'bar', 'class'],

      '4+': ['d+', 'd+', 'd+', 's-'],
      '5-': ['d-', 'd-', 'd-', 'd-', 's+'],
    };
  }

  outerElement(tagName, push, pop) {
    var child = pop();
    var element = document.createElement(tagName);
    while (child !== '(') {
      element.prepend(toNode(child, 'span'));
      child = pop();
    }
    push(element);
  }

  innerElement(tagName, push, pop) {
    const child = pop();
    if (child !== '[') {
      var element = document.createElement(tagName);
      element.append(toNode(child, 'span'));
      this.innerElement(tagName, push, pop);
      push(element);
    }
  }

  definition(words) {
    const key = words.shift();
    var value = [];
    var word = words.shift();
    while (word !== ';') {
      value.push(word);
      word = words.shift();
    }
    this.dictionary[key] = value;
  }

  interpret(text, debug) {
    var words = text.trim().split(/[ \n]+/);
    var stack = [];

    function push(x) {
      stack.push(x);
    }

    function pop() {
      return stack.pop();
    }

    function toLog(x) {
      return x instanceof Element ? x.outerHTML : x;
    }

    while (words.length > 0) {
      const word = words.shift();

      if (debug) {
        console.log(`${[...stack.map(toLog), '←', word].join(' ')}`);
      }

      if (word === 'chord') {
        const d = pop();
        const k = pop();
        push(new Chord(k, d));

      } else if (
        word === '+' || word === 'x' || word === '=' ||
        word === '^' || word === 'o' || word === '_') {
        const i = pop();
        const f = pop();
        const s = pop();
        const c = pop();
        push(c.add(s, f, i, word, false));

      } else if (
        word === '(+)' || word === '(x)' || word === '(=)' ||
        word === '(^)' || word === '(o)' || word === '(_)') {
        const i = pop();
        const f = pop();
        const s = pop();
        const c = pop();
        push(c.add(s, f, i, word.at(1), true));

      } else if (word === '.') {
        const l = pop();
        const i = pop();
        const f = pop();
        const s = pop();
        const c = pop();
        push(c.add(s, f, i, l));

      } else if (word === "'") {
        const j = pop();
        const c = pop();
        const b = pop();
        push(b);
        push(c.push(b.stops[j]));

      } else if (word === '@') {
        push(pop().rot());

      } else if (word === '*') {
        const c = pop();
        c.options.setOptional(true);
        push(c);

      } else if (word === '$') {
        const c = pop();
        c.options.setNoSymbol(true);
        push(c);

      } else if (word === '!') {
        const t = pop();
        const c = pop();
        c.options.setText(t);
        push(c);

      } else if (word === '#') {
        const f = pop();
        const s = pop();
        const c = pop();
        c.options.setFinger(s, f);
        push(c);

      } else if (word === '?') {
        const b = pop();
        const a = pop();
        push(a.isValid() ? a : b);

      } else if (word === 's+') {
        push(pop().incString());

      } else if (word === 's-') {
        push(pop().decString());

      } else if (word === 'd+') {
        push(pop().incDegree());

      } else if (word === 'd-') {
        push(pop().decDegree());

      } else if (word === 'i+') {
        push(pop().incInversion());

      } else if (word === 'i-') {
        push(pop().decInversion());

      } else if (word === 'o+') {
        push(pop().incOctave());

      } else if (word === 'o-') {
        push(pop().decOctave());

      } else if (word === 'af') {
        alignFrets(stack.filter(x => x instanceof Chord));

      } else if (word === 'am') {
        alignMarks(stack.filter(x => x instanceof Chord));

      } else if (word === 'drop') {
        pop();

      } else if (word === 'swap') {
        const a = pop();
        const b = pop();
        push(a);
        push(b);

      } else if (word === 'dupe') {
        const a = pop();
        if (a instanceof Element) {
          push(a);
          push(a.cloneNode(true));
        } else if (a instanceof Chord) {
          push(a);
          push(a.copy());
        } else {
          push(a);
          push(a);
        }

      } else if (word === 'over') {
        const a = pop();
        const b = pop();
        push(b);
        push(a);
        push(b.copy());

      } else if (word === 'class') {
        var n = pop();
        var e = pop();
        e.setAttribute('class', n);
        push(e);

      } else if (word === ')') {
        this.outerElement(pop(), push, pop);

      } else if (word === ']') {
        this.innerElement(pop(), push, pop);

      } else if (word === ':') {
        this.definition(words);

      } else if (word in this.dictionary) {
        words = this.dictionary[word].concat(words);

      } else if (isNaN(word) || word.trim().length == 0) {
        push(word);

      } else {
        push(parseInt(word, 10));
      }
    }
    if (debug) {
      console.log(`${stack.map(toLog).join(' ')}`);
    }
    return stack.length == 1 ? stack[0] : stack;
  }
}

var impl = new Interpreter();

export function interpret(text, debug) {
  return impl.interpret(text, debug);
}
