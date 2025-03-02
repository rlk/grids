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

import { createGrid } from './grid.js'

const pitchIncAtDegree = {
  1: 2, 2: 2, 3: 1, 4: 2, 5: 2, 6: 2, 7: 1,
};
const pitchDecAtDegree = {
  1: 1, 2: 2, 3: 2, 4: 1, 5: 2, 6: 2, 7: 2,
};
const pitchOfString = {
  1: 5, 2: 12, 3: 8, 4: 3, 5: 10, 6: 5,
};
const pitchOfName = {
  'C♭': 12, 'C':  1, 'C♯':  2,
  'D♭':  2, 'D':  3, 'D♯':  4,
  'E♭':  4, 'E':  5, 'E♯':  6,
  'F♭':  5, 'F':  6, 'F♯':  7,
  'G♭':  7, 'G':  8, 'G♯':  9,
  'A♭':  9, 'A': 10, 'A♯': 11,
  'B♭': 11, 'B': 12, 'B♯':  1,
};
const offsetOfInterval = {
  1: 0, 2: 2, 3: 4, 4: 5, 5: 7, 6: 9, 7: 11
};
const nameOfDegreePerKey = {
    'C'  : { 1: 'C',  2: 'D',  3: 'E',  4: 'F',  5: 'G',  6: 'A',  7: 'B'  },
    'F'  : { 1: 'F',  2: 'G',  3: 'A',  4: 'B♭', 5: 'C',  6: 'D',  7: 'E'  },
    'B♭' : { 1: 'B♭', 2: 'C',  3: 'D',  4: 'E♭', 5: 'F',  6: 'G',  7: 'A'  },
    'E♭' : { 1: 'E♭', 2: 'F',  3: 'G',  4: 'A♭', 5: 'B♭', 6: 'C',  7: 'D'  },
    'A♭' : { 1: 'A♭', 2: 'B♭', 3: 'C',  4: 'D♭', 5: 'E♭', 6: 'F',  7: 'G'  },
    'D♭' : { 1: 'D♭', 2: 'E♭', 3: 'F',  4: 'G♭', 5: 'A♭', 6: 'B♭', 7: 'C'  },
    'G♭' : { 1: 'G♭', 2: 'A♭', 3: 'B♭', 4: 'C♭', 5: 'D♭', 6: 'E♭', 7: 'F'  },
    'C♭' : { 1: 'C♭', 2: 'D♭', 3: 'E♭', 4: 'F♭', 5: 'G♭', 6: 'A♭', 7: 'B♭' },
    'G'  : { 1: 'G',  2: 'A',  3: 'B',  4: 'C',  5: 'D',  6: 'E',  7: 'F♯' },
    'D'  : { 1: 'D',  2: 'E',  3: 'F♯', 4: 'G',  5: 'A',  6: 'B',  7: 'C♯' },
    'A'  : { 1: 'A',  2: 'B',  3: 'C♯', 4: 'D',  5: 'E',  6: 'F♯', 7: 'G♯' },
    'E'  : { 1: 'E',  2: 'F♯', 3: 'G♯', 4: 'A',  5: 'B',  6: 'C♯', 7: 'D♯' },
    'B'  : { 1: 'B',  2: 'C♯', 3: 'D♯', 4: 'E',  5: 'F♯', 6: 'G♯', 7: 'A♯' },
    'F♯' : { 1: 'F♯', 2: 'G♯', 3: 'A♯', 4: 'B',  5: 'C♯', 6: 'D♯', 7: 'E♯' },
    'C♯' : { 1: 'C♯', 2: 'D♯', 3: 'E♯', 4: 'F♯', 5: 'G♯', 6: 'A♯', 7: 'B♯' },
};
const symbolOfSpelling = {
  ',0,,0,,0':        ['',    ''],
  ',0,,-1,,0':       ['mi',  ''],
  ',0,,-1,,-1':      ['dim', ''],
  ',0,,0,,1':        ['aug', ''],
  ',0,,,0,0':        ['sus', ''],

  ',0,,0,,0,0':      ['',   '6'],
  ',0,,-1,,0,0':     ['mi', '6'],

  ',0,,0,,0,,0':     ['ma', '7'],
  ',0,0,0,,0,,0':    ['ma', '9'],
  ',0,0,0,,0,0,0':   ['ma', '13'],

  ',0,,0,,0,,-1':    ['',   '7'],
  ',0,0,0,,0,,-1':   ['',   '9'],
  ',0,0,0,,0,0,-1':  ['',   '13'],

  ',0,,,0,0,,-1':    ['sus', '7'],
  ',0,0,,0,0,,-1':   ['sus', '9'],
  ',0,0,,0,0,0,-1':  ['sus', '13'],

  ',0,,-1,,0,,-1':   ['mi', '7'],
  ',0,0,-1,,0,,-1':  ['mi', '9'],
  ',0,0,-1,,0,0,-1': ['mi', '13'],

  ',0,,0,,-1,,0':    ['ma', '7♭5'],
  ',0,,-1,,-1,,-1':  ['mi', '7♭5'],
  ',0,,0,,1,,0':     ['ma', '7♯5'],
  ',0,,-1,,1,,-1':   ['mi', '7♯5'],

  ',0,,-1,,-1,,-2':  ['dim', '7'],
};

export function flatten(name) {
  return (name + '♭').replace('♯♭', '').replace('♭♭', '𝄫');
}

export function sharpen(name) {
  return (name + '♯').replace('♭♯', '').replace('♯♯', '𝄪');
}

function _degree(degree) {
  if (degree < 1) {
    return _degree(degree + 7);
  }
  if (degree > 7) {
    return _degree(degree - 7);
  }
  return degree;
}

function _pitch(pitch) {
  if (pitch < 1) {
    return _pitch(pitch + 12);
  }
  if (pitch > 12) {
    return _pitch(pitch - 12);
  }
  return pitch;
}

function _offset(root, pitch, interval) {
  var offset = pitch - _pitch(root + offsetOfInterval[interval])
  if (offset < -2) {
    return offset + 12
  }
  if (offset > 2) {
    return offset - 12
  }
  return offset
}

export class Stop {
  constructor(string, fret, degree, label = '+') {
    this.string = string;
    this.fret = fret;
    this.degree = degree;
    this.label = label;
  }

  toString() {
    return `${this.label}:${this.string}:${this.fret}`;
  }

  isValid() {
    return "+xsdo_".includes(this.label)
      && this.string >= 1
      && this.string <= 6
      && this.fret >= 0
      && this.degree >= 1
      && this.degree <= 7;
  }

  pitch() {
    return _pitch(pitchOfString[this.string] + this.fret);
  }

  interval(root) {
    return _degree(this.degree - root + 1);
  }

  incString() {
    return new Stop(this.string + 1, this.string == 2 ? this.fret + 4 : this.fret + 5, this.degree, this.label)
  }

  decString() {
    return new Stop(this.string - 1, this.string == 3 ? this.fret - 4 : this.fret - 5, this.degree, this.label)
  }

  incDegree() {
    return new Stop(this.string, this.fret + pitchIncAtDegree[this.degree], _degree(this.degree + 1), this.label)
  }

  decDegree() {
    return new Stop(this.string, this.fret - pitchDecAtDegree[this.degree], _degree(this.degree - 1), this.label)
  }

  incToDegree(degree) {
    return this.degree == degree ? this : this.incDegree().incToDegree(degree);
  }

  decToDegree(degree) {
    return this.degree == degree ? this : this.decDegree().decToDegree(degree);
  }
}

export class Symbol {
  constructor(root, triad = '', extension = '') {
    this.root = root;
    this.triad = triad;
    this.extension = extension;
  }

  toString() {
    if (this.extension) {
      return `n:${this.root}${this.triad} e:${this.extension}`
    } else {
      return `n:${this.root}${this.triad}`
    }
  }
}

export class Chord {
  constructor(key, degree, stops=[]) {
    this.key = key
    this.degree = degree
    this.stops = stops
    this.minFret = null
    this.maxFret = null
  }

  // toString() {
  //   return `${this.key}${this.degree}[${this.stops.map((stop) => stop.toString()).join(' ')}]`;
  // }

  toString() {
    const frets = this.stops.map((s) => s.fret)
    const stop1 = new Stop(1, this.minFret ?? Math.min(...frets), 0, '_');
    const stop6 = new Stop(6, this.maxFret ?? Math.max(...frets), 0, '_');
    const stops = this.stops.concat([stop1, stop6]).sort()

    if (this.mark()) {
        return `${stops.join(' ')} ${this.symbol().toString()} F:${this.mark()}`;
    } else {
        return `${stops.join(' ')} ${this.symbol().toString()}`;
    }
  }

  isValid() {
    return this.stops.every((stop) => stop.isValid())
      && this.degree >= 1
      && this.degree <= 7
      && this.key in nameOfDegreePerKey;
  }

  _minFret() {
    return Math.min(...this.stops.map((stop) => stop.fret));
  }

  _maxFret() {
    return Math.max(...this.stops.map((stop) => stop.fret));
  }

  _add(label, ...notes) {
    return new Chord(this.key, this.degree,
      this.stops.concat(notes.map(([string, fret, degree]) =>
        new Stop(string, fret, _degree(this.degree + degree - 1), label))));
  }

  push(string, fret, interval, label) {
    this.stops.push(new Stop(string, fret, _degree(this.degree + interval - 1), label));
    return this;
  }

  add(...notes) {
    return this._add('+', ...notes)
  }

  addx(...notes) {
    return this._add('x', ...notes)
  }

  adds(...notes) {
    return this._add('s', ...notes)
  }

  addd(...notes) {
    return this._add('d', ...notes)
  }

  addo(...notes) {
    return this._add('o', ...notes)
  }

  add_(...notes) {
    return this._add('_', ...notes)
  }

  incString() {
    return new Chord(this.key, this.degree, this.stops.map((stop) => stop.incString()));
  }

  decString() {
    return new Chord(this.key, this.degree, this.stops.map((stop) => stop.decString()));
  }

  incDegree() {
    return new Chord(this.key, _degree(this.degree + 1), this.stops.map((stop) => stop.incDegree()));
  }

  decDegree() {
    return new Chord(this.key, _degree(this.degree - 1), this.stops.map((stop) => stop.decDegree()));
  }

  incInversion() {
    const sorted = this.stops.map((stop) => stop.degree).sort()
    const looped = sorted.concat(sorted)
    return new Chord(this.key, this.degree,
      this.stops.map((stop) => stop.incToDegree(looped[looped.indexOf(stop.degree) + 1])))
}

  decInversion() {
    const sorted = this.stops.map((stop) => stop.degree).sort().reverse()
    const looped = sorted.concat(sorted)
    return new Chord(this.key, this.degree,
      this.stops.map((stop) => stop.decToDegree(looped[looped.indexOf(stop.degree) + 1])))
  }

  mark() {
    const roots = this.stops.filter((stop) => stop.degree == this.degree)
                          .toSorted((a, b) => b.string - a.string);
    return roots.length ? roots[0].fret : this._minFret();
  }

  spelling() {
    const name = nameOfDegreePerKey[this.key][this.degree]
    const root = pitchOfName[name];

    var spelling = []
    this.stops.forEach(
      (stop) => spelling[stop.interval(this.degree)] =
          _offset(root, stop.pitch(), stop.interval(this.degree)));

    if (spelling[1] == -1) {
      return [flatten(name), spelling.map((offset) => offset + 1).toString()];
    }
    if (spelling[1] == +1) {
      return [sharpen(name), spelling.map((offset) => offset - 1).toString()];
    }
    return [name, spelling.toString()];
  }

  symbol() {
    const [name, spelling] = this.spelling()
    if (spelling in symbolOfSpelling) {
      const [triad, extension] = symbolOfSpelling[spelling];
      return new Symbol(name, triad, extension);
    } else {
      console.log(spelling);
      return new Symbol(name, '?', '?');
    }
  }

  element(tag) {
    var element = document.createElement(tag);
    element.setAttribute('class', 'grid');
    element.appendChild(createGrid(this.toString()));
    return element;
  }
}

export class Sequence {
  constructor() {
    this.chords = [];
  }

  toString() {
    return this.chords.map((chord) => `${chord.key}${chord.degree}`).join(' ');
  }

  top() {
    return this.chords[this.chords.length - 1];
  }

  add(chord) {
    this.chords.push(chord)
    return this
  }

  addNextUp() {
    return this.add(this.top().incDegree());
  }

  addNextDown() {
    return this.add(this.top().decDegree());
  }

  addFourthUp() {
    return this.add(this.top().incDegree().incDegree().incDegree().decString());
  }

  addFifthDown() {
    return this.add(this.top().decDegree().decDegree().decDegree().decDegree().incString());
  }

  addNextPairUp() {
    const a = this.chords[this.chords.length - 2];
    const b = this.chords[this.chords.length - 1];
    return this.add(a.incDegree()).add(b.incDegree());
  }

  addNextPairDown() {
    const a = this.chords[this.chords.length - 2];
    const b = this.chords[this.chords.length - 1];
    return this.add(a.decDegree()).add(b.decDegree());
  }

  alignMarks(size = undefined) {
    var lo = Math.max(...this.chords.map((chord) => chord.mark() - chord._minFret()));
    var hi = Math.max(...this.chords.map((chord) => chord._maxFret() - chord.mark()));
    if (size) {
      hi = -lo + Math.max(hi - lo, size);
    }
    for (var chord of this.chords) {
      chord.minFret = chord.mark() - lo;
      chord.maxFret = chord.mark() + hi;
    }
    return this;
  }

  alignFrets() {
    const lo = Math.min(...this.chords.map((chord) => chord._minFret()));
    const hi = Math.max(...this.chords.map((chord) => chord._maxFret()));
    for (var chord of this.chords) {
      chord.minFret = lo;
      chord.maxFret = hi;
    }
    return this;
  }

  element(tag) {
    return this.chords.map((chord) => chord.element(tag));
  }
}

export function generateGrid(text) {
  var stack = []

  const push = (x) => stack.push(x);
  const pop  = ( ) => stack.pop();

  const words = text.trim().split(/[ \n]+/);

  for (const word of words) {

    if (word == '+' || word == 'x' || word == 's' ||
        word == 'd' || word == 'o' || word == '_') {
      const interval = pop();
      const fret = pop();
      const string = pop();
      const chord = pop();
      push(chord.push(string, fret, interval, word));

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
      push(pop().element('td'));

    } else if (word == 'span') {
      push(pop().element('span'));

    } else if (isNaN(word)) {
      push(word);

    } else {
      push(parseInt(word));
    }
    // console.log(stack.toString());
  }
  return pop();
}
