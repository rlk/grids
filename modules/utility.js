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

import { Stop } from './stop.js';
import { Chord } from './chord.js';
import { Sequence } from './sequence.js';

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

export function toOffset(root, pitch, interval) {
  var offset = pitch - toPitch(root + offsetOfInterval[interval])
  if (offset < -2) {
    return offset + 12
  }
  if (offset > 2) {
    return offset - 12
  }
  return offset
}

export function generateGrid(text) {
  var stack = []

  const push = (x) => stack.push(x);
  const pop  = ( ) => stack.pop();

  const words = text.trim().split(/[ \n]+/);

  for (const word of words) {

    if (word == '+' || word == 'x' || word == '=' ||
        word == '^' || word == 'o' || word == '_') {
      const interval = pop();
      const fret = pop();
      const string = pop();
      const chord = pop();
      push(chord.add(string, fret, interval, word));

    } else if (word == '.') {
      const label = pop();
      const interval = pop();
      const fret = pop();
      const string = pop();
      const chord = pop();
      push(chord.add(string, fret, interval, label));

    } else if (word == '!') {
      const note = pop();
      const chord = pop();
      push(chord.setNote(note));

    } else if (word == '#') {
      const finger = pop();
      const string = pop();
      const chord = pop();
      push(chord.setFinger(string, finger));

    } else if (word == 'cho') {
      const degree = pop();
      const key = pop();
      push(new Chord(key, degree));

    } else if (word == 'seq') {
      push(new Sequence());

    } else if (word == ',') {
      const chord = pop()
      const sequence = pop()
      push(sequence.add(chord));

    } else if (word == '1u') {
      push(pop().addNextUp());

    } else if (word == '1d') {
      push(pop().addNextDown());

    } else if (word == '4u') {
      push(pop().addFourthUp());

    } else if (word == '5d') {
      push(pop().addFifthDown());

    } else if (word == 'uu') {
      push(pop().addNextPairUp());

    } else if (word == 'dd') {
      push(pop().addNextPairDown());

    } else if (word == 'afret') {
      push(pop().alignFrets());

    } else if (word == 'amark') {
      push(pop().alignMarks());

    } else if (word == 'td') {
      push(pop().toElement('td'));

    } else if (word == 'span') {
      push(pop().toElement('span'));

    } else if (isNaN(word)) {
      push(word);

    } else {
      push(parseInt(word));
    }
    console.log(stack.toString());
  }
  return pop();
}
