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

export class Sequence {
  constructor() {
    this.chords = [];
  }

  toString() {
    return `[${this.chords.map((chord) => chord.toString()).join(' ')}]`
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
