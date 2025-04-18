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

import { flatten, sharpen, toDegree, toOffset, calcOffset } from './utility.js'
import { Stop } from './stop.js'
import { Options } from './options.js'
import { symbolFromOffsets } from './symbol.js'
import { createGrid } from './grid.js'

const pitchOfName = {
  'C♭': 12, 'C':  1, 'C♯':  2,
  'D♭':  2, 'D':  3, 'D♯':  4,
  'E♭':  4, 'E':  5, 'E♯':  6,
  'F♭':  5, 'F':  6, 'F♯':  7,
  'G♭':  7, 'G':  8, 'G♯':  9,
  'A♭':  9, 'A': 10, 'A♯': 11,
  'B♭': 11, 'B': 12, 'B♯':  1,
};

const nameOfDegree = {
  'C♯': [ null, 'C♯', 'D♯', 'E♯', 'F♯', 'G♯', 'A♯', 'B♯' ], // = D♭
  'F♯': [ null, 'F♯', 'G♯', 'A♯', 'B',  'C♯', 'D♯', 'E♯' ], // = G♭
  'B':  [ null, 'B',  'C♯', 'D♯', 'E',  'F♯', 'G♯', 'A♯' ], // = C♭
  'E':  [ null, 'E',  'F♯', 'G♯', 'A',  'B',  'C♯', 'D♯' ],
  'A':  [ null, 'A',  'B',  'C♯', 'D',  'E',  'F♯', 'G♯' ],
  'D':  [ null, 'D',  'E',  'F♯', 'G',  'A',  'B',  'C♯' ],
  'G':  [ null, 'G',  'A',  'B',  'C',  'D',  'E',  'F♯' ],
  'C':  [ null, 'C',  'D',  'E',  'F',  'G',  'A',  'B'  ],
  'F':  [ null, 'F',  'G',  'A',  'B♭', 'C',  'D',  'E'  ],
  'B♭': [ null, 'B♭', 'C',  'D',  'E♭', 'F',  'G',  'A'  ],
  'E♭': [ null, 'E♭', 'F',  'G',  'A♭', 'B♭', 'C',  'D'  ],
  'A♭': [ null, 'A♭', 'B♭', 'C',  'D♭', 'E♭', 'F',  'G'  ],
  'D♭': [ null, 'D♭', 'E♭', 'F',  'G♭', 'A♭', 'B♭', 'C'  ], // = C♯
  'G♭': [ null, 'G♭', 'A♭', 'B♭', 'C♭', 'D♭', 'E♭', 'F'  ], // = F♯
  'C♭': [ null, 'C♭', 'D♭', 'E♭', 'F♭', 'G♭', 'A♭', 'B♭' ], // = B
};

const incKey = {
  'C♯': 'D',
  'F♯': 'G',
  'B':  'C',
  'E':  'F',
  'A':  'B♭',
  'D':  'E♭',
  'G':  'A♭',
  'C':  'C♯',
  'F':  'F♯',
  'B♭': 'B',
  'E♭': 'E',
  'A♭': 'A',
  'D♭': 'D',
  'G♭': 'C',
  'C♭': 'C',
}

const decKey = {
  'C♯': 'C',
  'F♯': 'F',
  'B':  'B♭',
  'E':  'E♭',
  'A':  'A♭',
  'D':  'D♭',
  'G':  'G♭',
  'C':  'B',
  'F':  'E',
  'B♭': 'A',
  'E♭': 'D',
  'A♭': 'G',
  'D♭': 'C',
  'G♭': 'F',
  'C♭': 'B♭',
}

export class Chord {
  constructor(key = 'C', degree = 1, stops = [], options = new Options()) {
    this.key = key
    this.degree = degree
    this.stops = stops
    this.options = options
  }

  setKey(key) {
    this.key = key;
    return this;
  }

  setDegree(degree) {
    this.degree = toDegree(degree);
    return this;
  }

  setStops(stops) {
    this.stops = stops;
    return this;
  }

  setOptions(options) {
    this.options = options;
    return this;
  }

  copy() {
    return Object.assign(new Chord(), this, { options: this.options.copy() });
  }

  push(stop) {
    this.stops.push(stop.copy());
    return this;
  }

  add(string, fret, interval, label = '+', decor = false) {
    this.stops.push(new Stop(string, fret, toDegree(this.degree + interval - 1), label, decor));
    return this;
  }

  rot() {
    return this.copy().setStops([...this.stops.slice(1), this.stops[0]]);
  }

  isValid() {
    return this.stops.every(stop => stop.isValid())
      && this.degree >= 1
      && this.degree <= 7
      && this.key in nameOfDegree;
  }

  minFret() {
    return Math.min(...this.stops.map(stop => stop.fret));
  }

  maxFret() {
    return Math.max(...this.stops.map(stop => stop.fret));
  }

  incOctave() {
    return this.copy().setStops(this.stops.map(stop => stop.incOctave()));
  }

  decOctave() {
    return this.copy().setStops(this.stops.map(stop => stop.decOctave()));
  }

  incString() {
    return this.copy().setStops(this.stops.map(stop => stop.incString()));
  }

  decString() {
    return this.copy().setStops(this.stops.map(stop => stop.decString()));
  }

  incFret() {
    return this.copy().setStops(this.stops.map(stop => stop.incFret())).setKey(incKey[this.key]);
  }

  decFret() {
    return this.copy().setStops(this.stops.map(stop => stop.decFret())).setKey(decKey[this.key]);
  }

  incDegree() {
    return this.copy().setStops(this.stops.map(stop => stop.incDegree())).setDegree(this.degree + 1);
  }

  decDegree() {
    return this.copy().setStops(this.stops.map(stop => stop.decDegree())).setDegree(this.degree - 1);
  }

  incInversion() {
    const sorted = this.stops.map(stop => stop.degree).sort()
    const looped = sorted.concat(sorted)
    return this.copy().setStops(this.stops.map(stop => stop.incToDegree(looped[looped.indexOf(stop.degree) + 1])));
  }

  decInversion() {
    const sorted = this.stops.map(stop => stop.degree).sort().reverse()
    const looped = sorted.concat(sorted)
    return this.copy().setStops(this.stops.map(stop => stop.decToDegree(looped[looped.indexOf(stop.degree) + 1])));
  }

  mark() {
    const roots = this.stops.filter(stop => stop.degree == this.degree).toSorted((a, b) => b.string - a.string);
    const frets = this.stops.toSorted((a, b) => a.fret - b.fret);
    if (roots.length) {
      return roots[0].fret;
    }
    if (frets.length) {
      return frets[0].fret;
    }
    return 0;
  }

  symbol() {
    const name = nameOfDegree[this.key][this.degree];
    const root = pitchOfName[name];

    var offsets = new Array(8);
    this.stops.filter(stop => !stop.decor)
      .forEach(stop => offsets[stop.interval(this.degree)] =
        calcOffset(root, stop.pitch(), stop.interval(this.degree)));

    switch (offsets[1]) {
      case -1: return symbolFromOffsets(flatten(name), offsets.map(o => o + 1), this.bass());
      case +1: return symbolFromOffsets(sharpen(name), offsets.map(o => o - 1), this.bass());
      default: return symbolFromOffsets(name, offsets, this.bass());
    }
  }

  bass() {
    if (this.stops.length) {
      const stop = this.stops.toSorted((a, b) => b.string - a.string)[0];

      if (stop.interval(this.degree) != 1) {
        const name = nameOfDegree[this.key][stop.degree];

        switch (toOffset(stop.pitch() - pitchOfName[name])) {
          case -1: return flatten(name);
          case +1: return sharpen(name);
          default: return name;
        }
      }
    }
    return null;
  }

  toElement(localName) {
    var element = document.createElement(localName);
    element.setAttribute('class', 'grid');

    if (!this.options.nosymbol) {
      element.appendChild(this.symbol().toElement(this.options.optional));
    }

    element.appendChild(createGrid(this));

    if (this.options.text) {
      var text = element.appendChild(document.createElement('span'));
      text.setAttribute('class', 'text');
      text.textContent = this.options.text;
    }
    return element;
  }

  toString() {
    var elements = [];
    elements.push(`${this.key}`);
    elements.push(`${this.degree}`);
    elements.push(`[${this.stops.map(stop => stop.toString()).join(' ')}]`);
    elements.push(`${this.options.toString()}`);
    return `Chord(${elements.filter(s => s).join(' ')})`;
  }
}

export function alignMarks(chords, frets = 5) {
  var a = Math.min(...chords.map(c => c.minFret() - c.mark())) - 1;
  var z = Math.max(...chords.map(c => c.maxFret() - c.mark()));

  if (frets) {
    z = a + Math.max(z - a, frets);
  }
  chords.forEach(chord => chord.options.setGridMin(chord.mark() + a).setGridMax(chord.mark() + z));
}

export function alignFrets(chords, frets = 5) {
  var a = Math.min(...chords.map(c => c.minFret())) - 1;
  var z = Math.max(...chords.map(c => c.maxFret()));

  a = Math.max(a, 0);
  if (frets) {
    z = a + Math.max(z - a, frets);
  }
  chords.forEach(chord => chord.options.setGridMin(a).setGridMax(z));
}
