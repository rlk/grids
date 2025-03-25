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

import { Bar } from './bar.js';
import { Chord, alignMarks, alignFrets } from './chord.js';
import { Options } from './options.js';

const offsetOfInterval = {
  1: 0, 2: 2, 3: 4, 4: 5, 5: 7, 6: 9, 7: 11
};

export function flatten(name) {
  return (name + '♭').replace('♯♭', '').replace('♭♭', '𝄫');
}

export function sharpen(name) {
  return (name + '♯').replace('♭♯', '').replace('♯♯', '𝄪');
}

export function toDegree(degree) {
  if (degree < 1) {
    return toDegree(degree + 7);
  }
  if (degree > 7) {
    return toDegree(degree - 7);
  }
  return degree;
}

export function toPitch(pitch) {
  if (pitch < 1) {
    return toPitch(pitch + 12);
  }
  if (pitch > 12) {
    return toPitch(pitch - 12);
  }
  return pitch;
}

export function toOffset(offset) {
  if (offset < -2) {
    return offset + 12
  }
  if (offset > 2) {
    return offset - 12
  }
  return offset
}

export function calcOffset(root, pitch, interval) {
  return toOffset(pitch - toPitch(root + offsetOfInterval[interval]));
}

export function generateGrid(text, className = '') {
  var stack = []

  const words = text.trim().split(/[ \n]+/);
  for (const word of words) {

    // Chord constructors

    if (word == 'chord') {
      const d = stack.pop();
      const k = stack.pop();
      stack.push(new Chord(k, d));

    // Stop constructors

    } else if (word == '+' || word == 'x' || word == '=' ||
               word == '^' || word == 'o' || word == '_') {
      const i = stack.pop();
      const f = stack.pop();
      const s = stack.pop();
      const c = stack.pop();
      stack.push(c.add(s, f, i, word, false));

    } else if (word == '(+)' || word == '(x)' || word == '(=)' ||
               word == '(^)' || word == '(o)' || word == '(_)') {
      const i = stack.pop();
      const f = stack.pop();
      const s = stack.pop();
      const c = stack.pop();
      stack.push(c.add(s, f, i, word.at(1), true));

    } else if (word == '.') {
      const l = stack.pop();
      const i = stack.pop();
      const f = stack.pop();
      const s = stack.pop();
      const c = stack.pop();
      stack.push(c.add(s, f, i, l));

    // Chord options

    } else if (word == '?') {
      const c = stack.pop();
      stack.push(c.withOptions(c.options.withOptional(true)));

    } else if (word == '$') {
      const c = stack.pop();
      stack.push(c.withOptions(c.options.withNoSymbol(true)));

    } else if (word == '!') {
      const t = stack.pop();
      const c = stack.pop();
      stack.push(c.withOptions(c.options.withText(t)));

    } else if (word == '#') {
      const f = stack.pop();
      const s = stack.pop();
      const c = stack.pop();
      stack.push(c.withOptions(c.options.withFinger(s, f)));

    // Chord functions

    } else if (word == 's+') {
      stack.push(stack.pop().incString());

    } else if (word == 's-') {
      stack.push(stack.pop().decString());

    } else if (word == 'd+') {
      stack.push(stack.pop().incDegree());

    } else if (word == 'd-') {
      stack.push(stack.pop().decDegree());

    } else if (word == '4+') {
      stack.push(stack.pop().incDegree().incDegree().incDegree().decString());

    } else if (word == '5-') {
      stack.push(stack.pop().decDegree().decDegree().decDegree().decDegree().incString());

    } else if (word == 'i+') {
      stack.push(stack.pop().incInversion());

    } else if (word == 'i-') {
      stack.push(stack.pop().decInversion());

    } else if (word == 'o+') {
      stack.push(stack.pop().incOctave());

    } else if (word == 'o-') {
      stack.push(stack.pop().decOctave());

    // Bar constructors

    } else if (word == '|:') {
      stack.push(new Bar('&#x1D106;'));

    } else if (word == '|') {
      stack.push(new Bar('&#x1D100;'));

    } else if (word == ':|') {
      stack.push(new Bar('&#x1D107;'));

    } else if (word == 'spc') {
      stack.push(new Bar('&nbsp;'));

    // Stack-mapping functions

    } else if (word == 'af') {
      stack = alignFrets(stack);

    } else if (word == 'am') {
      stack = alignMarks(stack);

    } else if (word == 'td') {
      stack = stack.map((e) => e.toElement('td', text.trim(), className));

    } else if (word == 'span') {
      stack = stack.map((e) => e.toElement('span', text.trim(), className));

    // Stack functions

    } else if (word == 'drop') {
      stack.pop();

    } else if (word == 'swap') {
      const a = stack.pop();
      const b = stack.pop();
      stack.push(a, b);

    } else if (word == 'dupe') {
      const a = stack.pop();
      const b = a.copy();
      stack.push(a, b);

    } else if (word == 'over') {
      const a = stack.pop();
      const b = stack.pop();
      const c = b.copy();
      stack.push(b, a, c);

    } else if (isNaN(word)) {
      stack.push(word);

    } else {
      stack.push(parseInt(word));
    }
    if (className.includes('debug')) {
      console.log(stack.join(' '));
    }
  }
  return stack.length == 1 ? stack[0] : stack;
}
