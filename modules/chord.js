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

import { flatten, sharpen, toDegree, toOffset } from './utility.js'
import { Stop } from './stop.js'
import { symbolFromSpelling } from './symbol.js'
import { createSVG } from './grid.js'

const pitchOfName = {
  'C♭': 12, 'C':  1, 'C♯':  2,
  'D♭':  2, 'D':  3, 'D♯':  4,
  'E♭':  4, 'E':  5, 'E♯':  6,
  'F♭':  5, 'F':  6, 'F♯':  7,
  'G♭':  7, 'G':  8, 'G♯':  9,
  'A♭':  9, 'A': 10, 'A♯': 11,
  'B♭': 11, 'B': 12, 'B♯':  1,
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

export class Chord {
  constructor(key, degree, stops=[]) {
    this.key = key
    this.degree = degree
    this.stops = stops
    this.minFret = null
    this.maxFret = null
  }

  toString() {
    return `${this.key}${this.degree}[${this.stops.map((stop) => stop.toString()).join(' ')}]`;
  }

  isValid() {
    return this.stops.every((stop) => stop.isValid())
      && this.degree >= 1
      && this.degree <= 7
      && this.key in nameOfDegreePerKey;
  }

  _minFret() {
    return this.minFret ?? Math.min(...this.stops.map((stop) => stop.fret));
  }

  _maxFret() {
    return this.maxFret ?? Math.max(...this.stops.map((stop) => stop.fret));
  }

  _add(label, ...notes) {
    return new Chord(this.key, this.degree,
      this.stops.concat(notes.map(([string, fret, degree]) =>
        new Stop(string, fret, toDegree(this.degree + degree - 1), label))));
  }

  push(string, fret, interval, label) {
    this.stops.push(new Stop(string, fret, toDegree(this.degree + interval - 1), label));
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
    return new Chord(this.key, toDegree(this.degree + 1), this.stops.map((stop) => stop.incDegree()));
  }

  decDegree() {
    return new Chord(this.key, toDegree(this.degree - 1), this.stops.map((stop) => stop.decDegree()));
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
    const frets = this.stops.toSorted((a, b) => a.fret - b.fret);
    return roots.length ? roots[0].fret : frets[0].fret;
  }

  symbol() {
    const name = nameOfDegreePerKey[this.key][this.degree]
    const root = pitchOfName[name];

    var spelling = []
    this.stops.forEach(
      (stop) => spelling[stop.interval(this.degree)] =
          toOffset(root, stop.pitch(), stop.interval(this.degree)));

    if (spelling[1] == -1) {
      return symbolFromSpelling(flatten(name), spelling.map((offset) => offset + 1).toString());
    }
    if (spelling[1] == +1) {
      return symbolFromSpelling(sharpen(name), spelling.map((offset) => offset - 1).toString());
    }
    return symbolFromSpelling(name, spelling.toString());
  }

  element(tag) {
    var element = document.createElement(tag);
    element.setAttribute('class', 'grid');
    element.appendChild(createSVG(this));
    return element;
  }
}
