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
import { symbolFromSpelling } from './symbol.js'
import { createGrid } from './grid.js'

const pitchOfName = {
  'C♭': 12, 'C': 1, 'C♯': 2,
  'D♭': 2, 'D': 3, 'D♯': 4,
  'E♭': 4, 'E': 5, 'E♯': 6,
  'F♭': 5, 'F': 6, 'F♯': 7,
  'G♭': 7, 'G': 8, 'G♯': 9,
  'A♭': 9, 'A': 10, 'A♯': 11,
  'B♭': 11, 'B': 12, 'B♯': 1,
};
const nameOfDegreePerKey = {
  'C': { 1: 'C', 2: 'D', 3: 'E', 4: 'F', 5: 'G', 6: 'A', 7: 'B' },
  'F': { 1: 'F', 2: 'G', 3: 'A', 4: 'B♭', 5: 'C', 6: 'D', 7: 'E' },
  'B♭': { 1: 'B♭', 2: 'C', 3: 'D', 4: 'E♭', 5: 'F', 6: 'G', 7: 'A' },
  'E♭': { 1: 'E♭', 2: 'F', 3: 'G', 4: 'A♭', 5: 'B♭', 6: 'C', 7: 'D' },
  'A♭': { 1: 'A♭', 2: 'B♭', 3: 'C', 4: 'D♭', 5: 'E♭', 6: 'F', 7: 'G' },
  'D♭': { 1: 'D♭', 2: 'E♭', 3: 'F', 4: 'G♭', 5: 'A♭', 6: 'B♭', 7: 'C' },
  'G♭': { 1: 'G♭', 2: 'A♭', 3: 'B♭', 4: 'C♭', 5: 'D♭', 6: 'E♭', 7: 'F' },
  'C♭': { 1: 'C♭', 2: 'D♭', 3: 'E♭', 4: 'F♭', 5: 'G♭', 6: 'A♭', 7: 'B♭' },
  'G': { 1: 'G', 2: 'A', 3: 'B', 4: 'C', 5: 'D', 6: 'E', 7: 'F♯' },
  'D': { 1: 'D', 2: 'E', 3: 'F♯', 4: 'G', 5: 'A', 6: 'B', 7: 'C♯' },
  'A': { 1: 'A', 2: 'B', 3: 'C♯', 4: 'D', 5: 'E', 6: 'F♯', 7: 'G♯' },
  'E': { 1: 'E', 2: 'F♯', 3: 'G♯', 4: 'A', 5: 'B', 6: 'C♯', 7: 'D♯' },
  'B': { 1: 'B', 2: 'C♯', 3: 'D♯', 4: 'E', 5: 'F♯', 6: 'G♯', 7: 'A♯' },
  'F♯': { 1: 'F♯', 2: 'G♯', 3: 'A♯', 4: 'B', 5: 'C♯', 6: 'D♯', 7: 'E♯' },
  'C♯': { 1: 'C♯', 2: 'D♯', 3: 'E♯', 4: 'F♯', 5: 'G♯', 6: 'A♯', 7: 'B♯' },
};

export class Chord {
  constructor(key, degree, stops = []) {
    this.key = key
    this.degree = degree
    this.stops = stops
    this.nosymbol = false
    this.optional = false
    this.fingers = {}
    this.text = null
    this.gridMin = null
    this.gridMax = null
  }

  setKey(key) {
    this.key = key;
    return this;
  }

  setDegree(degree) {
    this.degree = degree;
    return this;
  }

  setStops(stops) {
    this.stops = stops;
    return this;
  }

  setNoSymbol(nosymbol) {
    this.nosymbol = nosymbol;
    return this;
  }

  setOptional(optional) {
    this.optional = optional;
    return this;
  }

  setFingers(fingers) {
    this.fingers = fingers;
    return this;
  }

  setText(text) {
    this.text = text;
    return this;
  }

  copy() {
    return new Chord(this.key, this.degree)
      .setStops(this.stops.map((stop => stop.copy())))
      .setNoSymbol(this.nosymbol)
      .setOptional(this.optional)
      .setFingers({ ...this.fingers })
      .setText(this.text);
  }

  add(string, fret, interval, label = '+', decor = false) {
    this.stops.push(new Stop(string, fret, toDegree(this.degree + interval - 1), label, decor));
    return this;
  }

  addFinger(string, finger) {
    this.fingers[string] = finger;
    return this;
  }

  isValid() {
    return this.stops.every((stop) => stop.isValid())
      && this.degree >= 1
      && this.degree <= 7
      && this.key in nameOfDegreePerKey;
  }

  minFret() {
    return Math.min(...this.stops.map((stop) => stop.fret));
  }

  maxFret() {
    return Math.max(...this.stops.map((stop) => stop.fret));
  }

  incString() {
    return this.copy().setStops(this.stops.map((stop) => stop.incString()));
  }

  decString() {
    return this.copy().setStops(this.stops.map((stop) => stop.decString()));
  }

  incDegree() {
    return this.copy().setDegree(toDegree(this.degree + 1)).setStops(this.stops.map((stop) => stop.incDegree()));
  }

  decDegree() {
    return this.copy().setDegree(toDegree(this.degree - 1)).setStops(this.stops.map((stop) => stop.decDegree()));
  }

  incInversion() {
    const sorted = this.stops.map((stop) => stop.degree).sort()
    const looped = sorted.concat(sorted)
    return this.copy().setStops(
      this.stops.map((stop) => stop.incToDegree(looped[looped.indexOf(stop.degree) + 1])));
  }

  decInversion() {
    const sorted = this.stops.map((stop) => stop.degree).sort().reverse()
    const looped = sorted.concat(sorted)
    return this.copy().setStops(
      this.stops.map((stop) => stop.decToDegree(looped[looped.indexOf(stop.degree) + 1])));
  }

  incOctave() {
    return this.copy().setStops(this.stops.map((stop) => stop.incOctave()));
  }

  decOctave() {
    return this.copy().setStops(this.stops.map((stop) => stop.decOctave()));
  }

  mark() {
    const roots = this.stops.filter((stop) => stop.degree == this.degree).toSorted((a, b) => b.string - a.string);
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
    const name = nameOfDegreePerKey[this.key][this.degree];
    const root = pitchOfName[name];

    var spelling = new Array(8);
    this.stops.filter((stop) => !stop.decor)
      .forEach((stop) => spelling[stop.interval(this.degree)] =
        calcOffset(root, stop.pitch(), stop.interval(this.degree)));

    switch (spelling[1]) {
      case -1: return symbolFromSpelling(flatten(name), spelling.map((o) => o + 1), this.bass());
      case +1: return symbolFromSpelling(sharpen(name), spelling.map((o) => o - 1), this.bass());
      default: return symbolFromSpelling(name, spelling, this.bass());
    }
  }

  bass() {
    if (this.stops.length) {
      const stop = this.stops.toSorted((a, b) => b.string - a.string)[0];

      if (stop.interval(this.degree) != 1) {
        const name = nameOfDegreePerKey[this.key][stop.degree];

        switch (toOffset(stop.pitch() - pitchOfName[name])) {
          case -1: return flatten(name);
          case +1: return sharpen(name);
          default: return name;
        }
      }
    }
    return null;
  }

  toElement(tagName, className = '') {
    var chord = document.createElement(tagName);
    chord.setAttribute('class', className.replace('gridgen', 'grid'));
    var column = document.createElement('span');
    column.setAttribute('class', 'column');

    if (!this.nosymbol) {
      column.appendChild(this.symbol().toElement(this.optional));
    }

    column.appendChild(createGrid(this));

    if (this.text) {
      var text = document.createElement('span');
      text.setAttribute('class', 'note');
      text.innerHTML = this.text;
      column.appendChild(text);
    }

    chord.appendChild(column);
    return chord;
  }

  toString() {
    const stops = `${this.stops.map((stop) => stop.toString()).join(' ')}`
    if (this.text) {
      return `Chord(${this.key} ${this.degree} [${stops}] "${this.text}")`;
    } else {
      return `Chord(${this.key} ${this.degree} [${stops}])`;
    }
  }
}

export function alignMarks(chords, frets = 5) {
  var min = Math.max(...chords.map((chord) => chord.mark() - chord.minFret() + 1));
  var max = Math.max(...chords.map((chord) => chord.maxFret() - chord.mark()));

  if (frets) {
    max = -min + Math.max(max - min, frets);
  }
  for (var chord of chords) {
    chord.gridMin = chord.mark() - min;
    chord.gridMax = chord.mark() + max;
  }
  return chords;
}

export function alignFrets(chords, frets = 5) {
  var min = Math.max(0, Math.min(...chords.map((chord) => chord.minFret() - 1)));
  var max = Math.max(0, Math.max(...chords.map((chord) => chord.maxFret())));

  if (frets) {
    max = min + Math.max(max - min, frets);
  }
  for (var chord of chords) {
    chord.gridMin = min;
    chord.gridMax = max;
  }
  return chords;
}
